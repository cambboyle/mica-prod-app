import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/userModel';
import { body, validationResult } from 'express-validator';
import { sendEmail } from '../utils/email';

const router = express.Router();

// Validation middleware
const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('displayName').trim().notEmpty()
];

const validateResetPassword = [
  body('token').trim().notEmpty(),
  body('newPassword').isLength({ min: 6 })
];

// Google OAuth routes
router.get('/google',
  (req, res, next) => {
    console.log('Starting Google OAuth flow');
    next();
  },
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

router.get('/google/callback',
  (req, res, next) => {
    console.log('Received Google callback');
    passport.authenticate('google', { session: false }, (err, user, info) => {
      console.log('Google auth result:', { err: err?.message, userId: user?.id, info });

      if (err) {
        console.error('Google OAuth Error:', err);
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(err.message)}`);
      }

      if (!user) {
        console.error('No user from Google OAuth:', info);
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=authentication_failed`);
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-jwt-secret'
        // Removed expiresIn - token will never expire
      );

      // Include minimal user data in the redirect
      const userData = {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        profilePic: user.profilePic
      };

      // Redirect to frontend with token and user data
      const userDataStr = encodeURIComponent(JSON.stringify(userData));
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&user=${userDataStr}`);
    })(req, res, next);
  }
);

// Local login
router.post('/login',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user!.id, email: req.user!.email },
      process.env.JWT_SECRET || 'your-jwt-secret'
      // Removed expiresIn - token will never expire
    );

    res.json({
      token,
      user: req.user
    });
  }
);

// Register new user
router.post('/register',
  validateRegistration,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, displayName } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Create new user
      const user = await User.create({
        email,
        password,
        displayName
      });

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-jwt-secret'
        // Removed expiresIn - token will never expire
      );

      res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Error creating user' });
    }
  }
);

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.json({ message: 'If an account exists with that email, you will receive a password reset link' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await user.update({
      resetToken,
      resetTokenExpiry
    });

    // Send email with reset link
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: `Please click on the following link to reset your password: ${resetUrl}`
    });

    res.json({ message: 'If an account exists with that email, you will receive a password reset link' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Error sending password reset email' });
  }
});

// Reset password
router.post('/reset-password', validateResetPassword, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, newPassword } = req.body;

    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password and clear reset token
    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out successfully' });
  });
});

export default router;