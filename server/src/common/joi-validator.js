const Joi = require('joi');

// Joi validation middleware that accepts separate schemas for params, query, and body
function joiValidator(schemas) {
	return (req, res, next) => {
		const { params, query, body } = schemas;
		const validationOptions = { abortEarly: false }; // to return all errors found

		// Validate params
		if (params) {
			const { error } = params.validate(req.params, validationOptions);
			if (error) {
				return res
					.status(400)
					.json({
						errors: error.details.map((detail) => detail.message)
					});
			}
		}

		// Validate query
		if (query) {
			const { error } = query.validate(req.query, validationOptions);
			if (error) {
				return res
					.status(400)
					.json({
						errors: error.details.map((detail) => detail.message)
					});
			}
		}

		// Validate body
		if (body) {
			const { error } = body.validate(req.body, validationOptions);
			if (error) {
				return res
					.status(400)
					.json({
						errors: error.details.map((detail) => detail.message)
					});
			}
		}

		next();
	};
}

module.exports = joiValidator;
