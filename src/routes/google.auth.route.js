import express from 'express';
import passport from '../config/passport.js';

import { googleLogin } from '../controllers/auth.google.controller.js';

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email"
    ],
    session: false,
    prompt: "select_account"
  })
);


router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/failed",
  }),
  googleLogin
);

router.get("/google/failed", (req, res) => {
  res.status(401).json({
    message: "Google authentication failed",
  });
});

export default router;