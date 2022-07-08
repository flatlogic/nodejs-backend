import express from 'express';

import config from '../config/config.js';
import path from 'path';
import passport from 'passport';
import { fileRequest } from '../services/file.js';

const router = express.Router();

router.get('/download', (req, res) => {
  const privateUrl = req.query.privateUrl;

  if (!privateUrl) {
    return res.sendStatus(404);
  }

  res.download(path.join(config.uploadDir, privateUrl));
});

router.post(
  '/upload/users/avatar',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    fileRequest('users/avatar', {
      entity: null,
      maxFileSize: 10 * 1024 * 1024,
      folderIncludesAuthenticationUid: false,
    })(req, res);
  },
);

export default router;
