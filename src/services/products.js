import db from '../db/models/index.js'
import config from '../config/config.js';
import fs from 'fs';
import path from 'path';

export async function getImages() {
  const files = await fs.promises.readdir(
    path.resolve(process.env.PWD + '/public/assets/products/'),
  );
  const result = files
    .filter(item => !/(^|\/)\.[^/.]/g.test(item))
    .map(f => config.remote + '/assets/products/' + f);
  return result;
}

export async function getProducts() {
  return await db.Product.findAll();
}

export async function getProduct(id) {
  return await db.Product.findByPk(id);
}

export async function updateProduct(id, body) {
  const [, model] = await db.Product.update(body, { where: { id }, returning: true, plain: true });
  const { dataValues } = model;
  return dataValues;
}

export async function createProduct(body) {
  const { id, ...product } = body;
  return await db.Product.create(product);
}

export async function deleteProduct(id) {
  return await db.Product.destroy({ where: { id } });
}
