const express = require('express');
const { getImages, getImage } = require('./controller');
const joiValidator = require('../../common/joi-validator');
const router = express.Router();
const Joi = require('joi');
const fs = require('fs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('js-yaml');
const swaggerDocument = YAML.load(
	fs.readFileSync(path.join(__dirname, './swagger.yaml'), 'utf8')
);

router.use(
	'/swagger-docs/images',
	swaggerUi.serve,
	swaggerUi.setup(swaggerDocument)
);
router.get('/v1/images', async (req, res) => {
	await getImages(req, res);
});

router.get(
	'/v1/image/:id',
	joiValidator({
		params: Joi.object({
			id: Joi.number().integer().min(1).required()
		})
	}),
	async (req, res) => {
		await getImage(req, res);
	}
);
module.exports = { galleryRoutes: router };
