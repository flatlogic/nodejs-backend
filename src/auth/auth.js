import config from '../config/config.js';
const { providers } = config;
import { jwtSign } from '../helpers.js';
import db from '../db/models/index.js';

import passport from 'passport';
import { Strategy as JWTstrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import * as UserDBApi from '../db/api/user.js';

passport.use(
  new JWTstrategy(
    {
      passReqToCallback: true,
      secretOrKey: config.secret_key,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (req, token, done) => {
      try {
        const user = await UserDBApi.findBy({ email: token.user.email });

        if (user && user.disabled) {
          return done(new Error(`User '${user.email}' is disabled`));
        }

        req.currentUser = user;

        return done(null, user);
      } catch (error) {
        done(error);
      }
    },
  ),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.apiUrl + '/auth/signin/google/callback',
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      socialStrategy(profile.email, profile, providers.GOOGLE, done);
    },
  ),
);

passport.use(
  new MicrosoftStrategy(
    {
      clientID: config.microsoft.clientId,
      clientSecret: config.microsoft.clientSecret,
      callbackURL: config.apiUrl + '/auth/signin/microsoft/callback',
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      const email = profile._json.mail || profile._json.userPrincipalName;
      socialStrategy(email, profile, providers.MICROSOFT, done);
    },
  ),
);

function socialStrategy(email, profile, provider, done) {
  db.user.findOrCreate({ where: { email, provider } }).then(([user, created]) => {
    const body = {
      id: user.id,
      email: user.email,
      name: profile.displayName,
    };
    const token = jwtSign({ user: body });
    return done(null, { token });
  });
}
