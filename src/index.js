import express from 'express';
import cors from 'cors';
import passport from 'passport';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import db from './db/models/index.js';
import cron from 'node-cron';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

import { exec } from 'child_process';

import authRoutes from './routes/auth.js';
import fileRoutes from './routes/file.js';
import userRoutes from './routes/user.js';
import analytics from './routes/analytics.js';
import products from './routes/products.js';

// swagger docs autogenerating options
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'User Management Template Backend',
      description:
        'Flatlogic user management backend allows you to create a fully workable data management (CRUD) application. ' +
        'You can perform all major operations with users - create, delete and distribute roles. You can either integrate this template into existing applications or create a new one based on it.',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development server',
      },
      {
        url: 'https://sing-generator-node.herokuapp.com/',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsDoc(options);

const app = express();

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

// cors
app.use(cors({ origin: true }));

app.use(
  helmet({
    referrerPolicy: { policy: 'no-referrer-when-downgrade' },
  }),
);

import './auth/auth.js';

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/file', fileRoutes);
app.use('/api/products', passport.authenticate('jwt', { session: false }), products);
app.use('/api/analytics', passport.authenticate('jwt', { session: false }), analytics);
app.use('/api/users', passport.authenticate('jwt', { session: false }), userRoutes);

app.use(express.static('public'));

const PORT = process.env.PORT || 8080;

db.sequelize.sync().then(function () {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
  cron.schedule('0 0 */1 * * *', () => {
    exec('yarn reset', err => {
      if (err) {
        console.error(err);
      }
    });
  });
});

export default app;
