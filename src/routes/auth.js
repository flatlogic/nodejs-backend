import express from 'express';
import passport from 'passport';

import config from '../config/config.js';
import * as AuthService from '../services/auth.js';
import { ForbiddenError } from '../services/notifications/errors/forbidden.js';
import { EmailSender } from '../services/email/index.js';
import { wrapAsync, commonErrorHandler } from '../helpers.js';

const router = express.Router();

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Auth:
 *        type: object
 *        required:
 *          - email
 *          - password
 *        properties:
 *          email:
 *            type: string
 *            default: admin@flatlogic.com
 *            description: User email
 *          password:
 *            type: string
 *            default: password
 *            description: User password
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authorization operations
 */

/**
 * @swagger
 *  /api/auth/signin/local:
 *    post:
 *      tags: [Auth]
 *      summary: Logs user into the system
 *      description: Logs user into the system
 *      requestBody:
 *        description: Set valid user email and password
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Auth"
 *      responses:
 *        200:
 *          description: Successful login
 *        400:
 *          description: Invalid username/password supplied
 *          content: { }
 *      x-codegen-request-body-name: body
 */

router.post(
  '/signin/local',
  wrapAsync(async (req, res) => {
    console.log(req.body);
    const payload = await AuthService.signin(req.body.email, req.body.password, req);
    res.status(200).send(payload);
  }),
);

/**
 * @swagger
 *  /api/auth/me:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Auth]
 *      summary: Get current authorized user info
 *      description: Get current authorized user info
 *      responses:
 *        200:
 *          description: Successful retrieval of current authorized user data
 *        400:
 *          description: Invalid username/password supplied
 *      x-codegen-request-body-name: body
 */

router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (!req.currentUser || !req.currentUser.id) {
    throw new ForbiddenError();
  }

  const payload = req.currentUser;
  res.status(200).send(payload);
});

router.put(
  '/password-reset',
  wrapAsync(async (req, res) => {
    const payload = await AuthService.passwordReset(req.body.token, req.body.password, req);
    res.status(200).send(payload);
  }),
);

router.put(
  '/password-update',
  passport.authenticate('jwt', { session: false }),
  wrapAsync(async (req, res) => {
    const payload = await AuthService.passwordUpdate(
      req.body.currentPassword,
      req.body.newPassword,
      req,
    );
    res.status(200).send(payload);
  }),
);

router.post(
  '/send-email-address-verification-email',
  passport.authenticate('jwt', { session: false }),
  wrapAsync(async (req, res) => {
    if (!req.currentUser) {
      throw new ForbiddenError();
    }

    await AuthService.sendEmailAddressVerificationEmail(req.currentUser.email);
    const payload = true;
    res.status(200).send(payload);
  }),
);

router.post(
  '/send-password-reset-email',
  wrapAsync(async (req, res) => {
    await AuthService.sendPasswordResetEmail(req.body.email, 'register', req.headers.host);
    const payload = true;
    res.status(200).send(payload);
  }),
);

/**
 * @swagger
 *  /api/auth/signup:
 *    post:
 *      tags: [Auth]
 *      summary: Register new user into the system
 *      description: Register new user into the system
 *      requestBody:
 *        description: Set valid user email and password
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Auth"
 *      responses:
 *        200:
 *          description: New user successfully signed up
 *        400:
 *          description: Invalid username/password supplied
 *        500:
 *          description: Some server error
 *      x-codegen-request-body-name: body
 */

router.post(
  '/signup',
  wrapAsync(async (req, res) => {
    const payload = await AuthService.signup(
      req.body.email,
      req.body.password,
      req,
      req.headers.host,
    );
    res.status(200).send(payload);
  }),
);

router.put(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  wrapAsync(async (req, res) => {
    if (!req.currentUser || !req.currentUser.id) {
      throw new ForbiddenError();
    }

    await AuthService.updateProfile(req.body.profile, req.currentUser);
    const payload = true;
    res.status(200).send(payload);
  }),
);

router.put(
  '/verify-email',
  wrapAsync(async (req, res) => {
    const payload = await AuthService.verifyEmail(req.query.token, req, req.headers.host);
    res.status(200).send(payload);
  }),
);

router.get('/email-configured', (req, res) => {
  const payload = EmailSender.isConfigured;
  res.status(200).send(payload);
});

router.get('/signin/google', (req, res, next) => {
  passport.authenticate('google', { scope: ['profile', 'email'], state: req.query.app })(
    req,
    res,
    next,
  );
});

router.get(
  '/signin/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),

  function (req, res) {
    socialRedirect(res, req.query.state, req.user.token, config);
  },
);

router.get('/signin/microsoft', (req, res, next) => {
  passport.authenticate('microsoft', {
    scope: ['https://graph.microsoft.com/user.read openid'],
    state: req.query.app,
  })(req, res, next);
});

router.get(
  '/signin/microsoft/callback',
  passport.authenticate('microsoft', {
    failureRedirect: '/login',
    session: false,
  }),
  function (req, res) {
    socialRedirect(res, req.query.state, req.user.token, config);
  },
);

router.use('/', commonErrorHandler);

function socialRedirect(res, state, token, config) {
  if (state) {
    return res.redirect(state + '#/login?token=' + token);
  }
  res.redirect(config.uiUrl + '/login?token=' + token);
}

export default router;
