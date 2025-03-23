const express = require('express');
const userRouter = require('./user');
const itemRouter = require('./item');
const orderRouter = require('./order');

const router = express.Router();

router.use('/user',userRouter);
router.use('/item',itemRouter);
router.use('/order',orderRouter);

module.exports = router;
