import express from 'express';

import * as UserService from '../services/user.js';
import * as UserDBApi from '../db/api/user.js';
import { wrapAsync, commonErrorHandler } from '../helpers.js';

const router = express.Router();

/**
 *  @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - email
 *        properties:
 *          id:
 *            type: string
 *            format: uuid
 *          no_disable:
 *            type: boolean
 *            default: false
 *          firstName:
 *            type: string
 *          password:
 *            type: string
 *          role:
 *            type: string
 *            enum:
 *              - admin
 *              - user
 *            default: user
 *          provider:
 *            type: string
 *            default: local
 *          emailVerified:
 *            type: boolean
 *            default: false
 *          emailVerificationToken:
 *            type: string
 *          emailVerificationTokenExpiresAt:
 *            type: string
 *            format: date-time
 *          passwordResetToken:
 *            type: string
 *          passwordResetTokenExpiresAt:
 *            type: string
 *            format: date-time
 *          lastName:
 *            type: string
 *          phoneNumber:
 *            type: string
 *          email:
 *            type: string
 *          authenticationUid:
 *            type: string
 *          disabled:
 *            type: boolean
 *            default: false
 *          importHash:
 *            type: string
 */

/**
 *  @swagger
 *  tags:
 *    name: User
 *    description: The users managing API
 */

/**
 *  @swagger
 *  /api/users:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags: [User]
 *      summary: Create new user
 *      description: Create new user
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                data:
 *                  description: New user data (email field required)
 *                  type: object
 *                  $ref: "#/components/schemas/User"
 *      responses:
 *        200:
 *          description: The user was successfully created
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/User"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        500:
 *          description: Some server error
 */

router.post(
  '/',
  wrapAsync(async (req, res) => {
    await UserService.create(req.body.data, req.currentUser, true, req.headers.referer);
    const payload = true;
    res.status(200).send(payload);
  }),
);

/**
 *  @swagger
 *  /api/users/{id}:
 *    put:
 *      security:
 *        - bearerAuth: []
 *      tags: [User]
 *      summary: Update the data of the selected user
 *      description: Update the data of the selected user
 *      parameters:
 *        - in: path
 *          name: id
 *          description: User ID to update
 *          required: true
 *          schema:
 *            type: string
 *      requestBody:
 *        description: ID of updated user (required), and updated user data.
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              properties:
 *                id:
 *                  description: ID of the updated user
 *                  type: string
 *                data:
 *                  description: Data of the updated user
 *                  type: object
 *                  $ref: "#/components/schemas/User"
 *              required:
 *                - id
 *      responses:
 *        200:
 *          description: The user data was successfully updated
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/User"
 *        400:
 *          description: Invalid ID supplied
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        500:
 *          description: Some server error
 */

router.put(
  '/:id',
  wrapAsync(async (req, res) => {
    console.log(req.body);
    await UserService.update(req.body.data, req.body.id, req.currentUser);

    const payload = true;
    res.status(200).send(payload);
  }),
);

/**
 * @swagger
 *  /api/users/{id}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags: [User]
 *      summary: Delete the selected user
 *      description: Delete the selected user
 *      parameters:
 *        - in: path
 *          name: id
 *          description: User ID to delete
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: The user was successfully deleted
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/User"
 *        400:
 *          description: Invalid ID supplied
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: User not found
 *        500:
 *          description: Some server error
 */

router.delete(
  '/:id',
  wrapAsync(async (req, res) => {
    console.log(req.body, req.params);
    await UserService.remove(req.params.id, req.currentUser);
    const payload = true;
    res.status(200).send(payload);
  }),
);

/**
 *  @swagger
 *  /api/users:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [User]
 *      summary: Get all users
 *      description: Get all users
 *      responses:
 *        200:
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/User"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        500:
 *          description: Some server error
 */

router.get(
  '/',
  wrapAsync(async (req, res) => {
    const payload = await UserDBApi.findAll(req.query);

    res.status(200).send(payload);
  }),
);

router.get('/autocomplete', async (req, res) => {
  const payload = await UserDBApi.findAllAutocomplete(req.query.query, req.query.limit);

  res.status(200).send(payload);
});

/**
 * @swagger
 *  /api/users/{id}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [User]
 *      summary: Get selected user data
 *      description: Get selected user data
 *      parameters:
 *        - in: path
 *          name: id
 *          description: ID of user to get
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/User"
 *        400:
 *          description: Invalid ID supplied
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: User not found
 *        500:
 *          description: Some server error
 */

router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    const payload = await UserDBApi.findBy({ id: req.params.id });

    res.status(200).send(payload);
  }),
);

router.use('/', commonErrorHandler);

export default router;
