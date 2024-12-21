import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/userModel';

// Validate required environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('Missing required Google OAuth environment variables');
  process.exit(1);
}

// Get the base URL for callbacks
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.BACKEND_URL || 'https://your-production-domain.com';
  }
  return 'http://localhost:5000';
};

// Serialize user for the session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } });
        
        if (!user) {
          return done(null, false, { message: 'Incorrect email.' });
        }

        const isValid = await user.validatePassword(password);
        
        if (!isValid) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${getBaseUrl()}/api/auth/google/callback`,
      scope: ['profile', 'email'],
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google OAuth callback received:', { profileId: profile.id });

        // Check if user already exists
        let user = await User.findOne({
          where: {
            googleId: profile.id
          }
        });

        if (!user && profile.emails && profile.emails.length > 0) {
          // Check if user exists with the email
          user = await User.findOne({
            where: {
              email: profile.emails[0].value
            }
          });

          if (user) {
            // Link Google account to existing user
            user.googleId = profile.id;
            await user.save();
            console.log('Linked Google account to existing user:', user.id);
          } else {
            // Create new user
            user = await User.create({
              googleId: profile.id,
              email: profile.emails[0].value,
              displayName: profile.displayName || profile.emails[0].value.split('@')[0],
              profilePic: profile.photos?.[0]?.value
            });
            console.log('Created new user from Google profile:', user.id);
          }
        }

        if (!user) {
          console.error('Failed to create/find user from Google profile');
          return done(null, false, { message: 'Failed to create user from Google profile' });
        }

        return done(null, user);
      } catch (error) {
        console.error('Google Strategy Error:', error);
        return done(error as Error);
      }
    }
  )
);

export default passport;
