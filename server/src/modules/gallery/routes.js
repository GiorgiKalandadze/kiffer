const express = require('express');
const {getImages} = require('./controller');
const router = express.Router();

router.get('/v1/images', async (req, res) => {
    await getImages(req, res);
});
module.exports = {galleryRoutes: router};