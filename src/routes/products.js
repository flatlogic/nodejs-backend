import express from "express";
import { Product } from "../db/models";

const router = express.Router();

router.get('/', (req, res) => {
    Product.findAll().then(products => {
        res.json(products);
    })

});

module.exports = router;