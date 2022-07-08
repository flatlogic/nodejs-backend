import express from 'express';
import * as ProductService from '../services/products.js';
import { wrapAsync } from '../helpers.js';

const router = express.Router();

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Product:
 *        type: object
 *        properties:
 *          img:
 *            type: string
 *          title:
 *            type: string
 *          subtitle:
 *            type: string
 *          price:
 *            type: integer
 *            format: int64
 *          rating:
 *            type: integer
 *            format: int64
 *          description_1:
 *            type: string
 *          description_2:
 *            type: string
 *          code:
 *            type: integer
 *            format: int64
 *          hashtag:
 *            type: string
 *          technology:
 *            type: array
 *            items:
 *              type: string
 *          discount:
 *            type: integer
 *            format: int64
 */

/**
 *  @swagger
 *  tags:
 *    name: Product
 *    description: The products managing API
 */

/**
 *  @swagger
 *  /api/products/images-list:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Product]
 *      summary: Get all products images
 *      description: Get all products images
 *      responses:
 *        200:
 *          description: Product images successfully received
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Product"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Data not found
 *        500:
 *          description: Some server error
 */

router.get(
  '/images-list',
  wrapAsync(async (req, res) => {
      res.json(await ProductService.getImages());
  }),
);

/**
 *  @swagger
 *  /api/products:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Product]
 *      summary: Get all products
 *      description: Get all products
 *      responses:
 *        200:
 *          description: Products list successfully received
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: "#/components/schemas/Product"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Data not found
 *        500:
 *          description: Some server error
 */

router.get(
  '/',
  wrapAsync(async (req, res) => {
      res.json(await ProductService.getProducts());
  }),
);

/**
 * @swagger
 *  /api/products/{id}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Product]
 *      summary: Get selected product
 *      description: Get selected product
 *      parameters:
 *        - in: path
 *          name: id
 *          description: ID of product to get
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Selected product successfully received
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Product"
 *        400:
 *          description: Invalid ID supplied
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Product not found
 *        500:
 *          description: Some server error
 */

router.get(
  '/:id',
  wrapAsync(async (req, res) => {
      res.json(await ProductService.getProduct(req.params.id));
  }),
);

/**
 *  @swagger
 *  /api/products/{id}:
 *    put:
 *      security:
 *        - bearerAuth: []
 *      tags: [Product]
 *      summary: Update the data of the selected product
 *      description: Update the data of the selected product
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Product ID to update
 *          required: true
 *          schema:
 *            type: string
 *      requestBody:
 *        description: Set new product data
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Product"
 *      responses:
 *        200:
 *          description: The product data was successfully updated
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Product"
 *        400:
 *          description: Invalid ID supplied
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Product not found
 *        500:
 *          description: Some server error
 */

router.put(
  '/:id',
  wrapAsync(async (req, res) => {
      res.json(await ProductService.updateProduct(req.params.id, req.body));
  }),
);

/**
 *  @swagger
 *  /api/products:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags: [Product]
 *      summary: Add new product
 *      description: Add new product
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Product"
 *      responses:
 *        200:
 *          description: The product was successfully added
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Product"
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        405:
 *          description: Invalid input data
 *        500:
 *          description: Some server error
 */

router.post(
  '/',
  wrapAsync(async (req, res) => {
      res.json(await ProductService.createProduct(req.body));
  }),
);

/**
 * @swagger
 *  /api/products/{id}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags: [Product]
 *      summary: Delete the selected product
 *      description: Delete the selected product
 *      parameters:
 *        - in: path
 *          name: id
 *          description: Product ID to delete
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: The product was successfully deleted
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Product"
 *        400:
 *          description: Invalid ID supplied
 *        401:
 *          $ref: "#/components/responses/UnauthorizedError"
 *        404:
 *          description: Product not found
 *        500:
 *          description: Some server error
 */

router.delete(
  '/:id',
  wrapAsync(async (req, res) => {
      res.json(await ProductService.deleteProduct(req.params.id));
  }),
);

export default router;
