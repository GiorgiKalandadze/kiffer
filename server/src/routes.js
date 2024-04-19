const express = require('express');
const router = express.Router();
const { galleryRoutes } = require('./modules/gallery/routes');

router.use('/', galleryRoutes);

module.exports = router;
