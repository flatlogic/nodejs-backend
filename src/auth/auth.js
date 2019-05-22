import config from "../config";
import helpers from "../helpers/helpers";
import db from "../db/models";

const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const apiURL = `${config.host}${config.port ? `:${config.port}`: ``}`;

passport.use(new JWTstrategy({
  secretOrKey: config.secret_key,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
}, async (token, done) => {
  try {
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));

passport.use(new GoogleStrategy({
    clientID: config.google.clientId,
    clientSecret: config.google.clientSecret,
    callbackURL: apiURL + "/user/signin/google/callback",
    passReqToCallback: true
  },
  function (request, accessToken, refreshToken, profile, done) {
    db.User.findOrCreate({ where: {username: profile.email}}).then(([user, created]) => {
      const body = {
        id: user.id,
        username: user.username
      };
      const token = helpers.jwtSign({user: body});
      return done(null, {token});
    });
  }
));


passport.use(new MicrosoftStrategy({
    clientID: config.microsoft.clientId,
    clientSecret: config.microsoft.clientSecret,
    callbackURL: apiURL + "/user/signin/microsoft/callback",
    passReqToCallback: true
  },
  function (request, accessToken, refreshToken, profile, done) {
  const username = profile._json.mail || profile._json.userPrincipalName;
    db.User.findOrCreate({where: {username}}).then(([user, created]) => {
      const body = {
        id: user.id,
        username: user.username
      };
      const token = helpers.jwtSign({user: body});
      return done(null, {token});
    });
  }
));