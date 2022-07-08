import formidable from 'formidable';
import fs from 'fs';
import config from '../config/config.js';
import path from 'path';

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);

  if (fs.existsSync(dirname)) {
    return true;
  }

  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

export function fileRequest(
  folder,
  validations = {
    entity: null,
    maxFileSize: null,
    folderIncludesAuthenticationUid: false,
  },
) {
  return (req, res) => {
    if (!req.currentUser) {
      res.sendStatus(403);
      return;
    }

    if (validations.entity) {
      res.sendStatus(403);
      return;
    }

    if (validations.folderIncludesAuthenticationUid) {
      folder = folder.replace(':userId', req.currentUser.authenticationUid);
      if (
        !req.currentUser.authenticationUid ||
        !folder.includes(req.currentUser.authenticationUid)
      ) {
        res.sendStatus(403);
        return;
      }
    }

    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadDir;

    if (validations && validations.maxFileSize) {
      form.maxFileSize = validations.maxFileSize;
    }

    form.parse(req, function (err, fields, files) {
      const filename = String(fields.filename);
      const fileTempUrl = files.file.path;

      if (!filename) {
        fs.unlinkSync(fileTempUrl);
        res.sendStatus(500);
        return;
      }

      const privateUrl = path.join(form.uploadDir, folder, filename);
      ensureDirectoryExistence(privateUrl);
      fs.renameSync(fileTempUrl, privateUrl);
      res.sendStatus(200);
    });

    form.on('error', function (err) {
      res.status(500).send(err);
    });
  };
}
