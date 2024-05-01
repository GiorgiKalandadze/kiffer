const express = require('express');
const {getMockImages, getMockImage, getImages, addImage, getImage, deleteImage} = require('./controller');
const joiValidator = require('../../common/joi-validator');
const router = express.Router();
const Joi = require('joi');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('js-yaml');
const {RESULT_CODES, RESULT_STATUSES} = require('../../common/constants');
const swaggerDocument = YAML.load(
    fs.readFileSync(path.join(__dirname, './swagger.yaml'), 'utf8'),
);

router.use(
    '/swagger-docs/images',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument),
);

const upload = multer({storage: multer.memoryStorage(), limits: {fileSize: 5 * 1024 * 1024}});

router.get('/v1/images', async (request, response) => {
    await getImages(request, response);
});

router.get('/v1/image/:id', async (request, response) => {
    await getImage(request, response);
});

router.post('/v1/image',
    upload.single('image'),
    (req, res, next) => {
        console.log(req);
        if (!req.file) {
            return res.status(400).json({
                resultCode: RESULT_CODES.ERROR,
                resultStatus: RESULT_STATUSES.ERROR,
                message: 'File is required',
                data: null,
            });
        }
        next();
    },
    async (request, response) => {
        await addImage(request, response);
    });

router.delete('/v1/image', async (request, response) => {
    await deleteImage(request, response);
});


router.get('/v1/mock-images', async (req, res) => {
    await getImages(req, res);
});

router.get(
    '/v1/mock-image/:id',
    joiValidator({
        params: Joi.object({
            id: Joi.number().integer().min(1).required(),
        }),
    }),
    async (req, res) => {
        await getImage(req, res);
    },
);

module.exports = {galleryRoutes: router};
