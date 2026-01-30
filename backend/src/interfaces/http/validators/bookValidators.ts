import Joi from 'joi';

export const createBookSchema = Joi.object({
  title: Joi.string().required().min(1).max(200).trim(),
  author: Joi.string().required().min(1).max(100).trim(),
  publicationYear: Joi.number()
    .required()
    .integer()
    .min(1000)
    .max(new Date().getFullYear() + 1),
  status: Joi.string().valid('available', 'reserved').default('available'),
});

export const updateBookSchema = Joi.object({
  title: Joi.string().optional().min(1).max(200).trim(),
  author: Joi.string().optional().min(1).max(100).trim(),
  publicationYear: Joi.number()
    .optional()
    .integer()
    .min(1000)
    .max(new Date().getFullYear() + 1),
  status: Joi.string().optional().valid('available', 'reserved'),
});

export const listBooksSchema = Joi.object({
  page: Joi.number().optional().integer().min(1).default(1),
  limit: Joi.number().optional().integer().min(1).max(100).default(10),
  search: Joi.string().optional().trim(),
  status: Joi.string().optional().valid('available', 'reserved'),
  sortBy: Joi.string()
    .optional()
    .valid('title', 'author', 'publicationYear', 'createdAt')
    .default('createdAt'),
  sortOrder: Joi.string().optional().valid('asc', 'desc').default('desc'),
});
