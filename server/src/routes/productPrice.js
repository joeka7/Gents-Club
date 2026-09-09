'use strict';

const express = require('express');
const { getPrices } = require('../services/priceScraper');

const router = express.Router();

router.get('/', (_req, res) => res.json(getPrices()));

module.exports = router;
