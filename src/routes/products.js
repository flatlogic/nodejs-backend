import express from "express";
import { Product } from "../db/models";

const router = express.Router();

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
    Product.update(req.body, {where: {id: req.params.id}}).then(([product]) => {
        res.json(product);
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