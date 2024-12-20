import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      // Check if the user exists, otherwise create a new user
      const [user, created] = await User.findOrCreate({
        where: { googleId: profile.id },
        defaults: {
          displayName: profile.displayName,
          email: profile.emails[0].value,
          profilePic: profile.photos[0]?.value || '',
        },
      });

      done(null, user);
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: number, done) => {
  User.findByPk(id).then((user) => done(null, user));
});
