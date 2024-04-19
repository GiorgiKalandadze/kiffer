const express = require('express');
const { getImages, getImage } = require('./controller');
const joiValidator = require('../../common/joi-validator');
const router = express.Router();
const Joi = require('joi');

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
