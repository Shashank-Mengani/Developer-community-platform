import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },

    async (profile, done) => {
      try {
        return done(null, {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
        });

      } catch (error) {
        console.log(error);
        return done(error, null);
      }
    }
  )
);

export default passport;