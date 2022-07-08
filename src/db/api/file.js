import db from '../models/index.js';
import assert from 'assert';

export async function replaceRelationFiles(relation, rawFiles, options) {
  assert(relation.belongsTo, 'belongsTo is required');
  assert(relation.belongsToColumn, 'belongsToColumn is required');
  assert(relation.belongsToId, 'belongsToId is required');

  let files = [];

  if (Array.isArray(rawFiles)) {
    files = rawFiles;
  } else {
    files = rawFiles ? [rawFiles] : [];
  }

  await removeLegacyFiles(relation, files, options);
  await addFiles(relation, files, options);
}

async function addFiles(relation, files, options) {
  const transaction = (options && options.transaction) || undefined;
  const currentUser = (options && options.currentUser) || { id: null };

  const inexistentFiles = files.filter(file => !!file.new);

  for (const file of inexistentFiles) {
    await db.file.create(
      {
        belongsTo: relation.belongsTo,
        belongsToColumn: relation.belongsToColumn,
        belongsToId: relation.belongsToId,
        name: file.name,
        sizeInBytes: file.sizeInBytes,
        privateUrl: file.privateUrl,
        publicUrl: file.publicUrl,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      {
        transaction,
      },
    );
  }
}

async function removeLegacyFiles(relation, files, options) {
  const transaction = (options && options.transaction) || undefined;

  const filesToDelete = await db.file.findAll({
    where: {
      belongsTo: relation.belongsTo,
      belongsToId: relation.belongsToId,
      belongsToColumn: relation.belongsToColumn,
      id: {
        [db.Sequelize.Op.notIn]: files.filter(file => !file.new).map(file => file.id),
      },
    },
    transaction,
  });

  for (let file of filesToDelete) {
    await file.destroy({
      transaction,
    });
  }
}
