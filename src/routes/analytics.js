import express from 'express';
import mock from '../mock.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json(mock.analytics);
});

export default router;
