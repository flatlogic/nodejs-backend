import express from "express";
import { Product } from "../db/models";
import config from "../config";
import fs from "fs";
import path from "path";

const router = express.Router();

router.get('/images-list', (req, res) => {
  fs.readdir(path.resolve(process.env.PWD + '/public/assets/products/'), (err, files) => {
    files = files.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item)).map(f => config.apiUrl + '/assets/products/' + f);
    res.json(files);
  });
});

router.get('/', (req, res) => {
    Product.findAll().then(products => {
        res.json(products);
    })

});

router.get('/:id', (req, res) => {
    Product.findByPk(req.params.id).then(product => {
        res.json(product);
    })

});

router.put('/:id', (req, res) => {
    Product.update(req.body, {where: {id: req.params.id}, returning: true, plain: true}).then(([, model]) => {
        res.json(model.dataValues);
    })
});

router.post('/', (req, res) => {
    let product = req.body;
    if (product.id) {
        delete product.id;
    }
    Product.create(req.body).then(product => {
        res.json(product);
    })

});

router.delete('/:id', (req, res) => {
    Product.destroy({where: {id: req.params.id}}).then(response => {
        res.json(response);
    })

});

module.exports = router;
