import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().required().email().lowercase().trim(),
  password: Joi.string().required().min(6).max(50),
  name: Joi.string().required().min(2).max(100).trim(),
  role: Joi.string().optional().valid('admin', 'user').default('user'),
});

export const loginSchema = Joi.object({
  email: Joi.string().required().email().lowercase().trim(),
  password: Joi.string().required(),
});
