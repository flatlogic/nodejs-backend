import express from "express";
import mock from "../mock";

const router = express.Router();

router.get('/', (req, res) => {
    res.json(mock.analytics);
});

module.exports = router;