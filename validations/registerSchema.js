const Joi = require("@hapi/joi");

const schemaRegister = Joi.object({
  user_name: Joi.string().min(6).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
  role: Joi.string().min(2).max(255).default('user'),
  reservations: Joi.array().default([]),
});

module.exports = schemaRegister;