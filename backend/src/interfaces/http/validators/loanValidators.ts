import Joi from 'joi';

export const createLoanSchema = Joi.object({
  bookId: Joi.string().required().length(24).hex(),
  userId: Joi.string().required().length(24).hex(),
  dueDate: Joi.date().required().greater('now'),
});

export const returnLoanSchema = Joi.object({
  returnDate: Joi.date().optional().max('now'),
});
