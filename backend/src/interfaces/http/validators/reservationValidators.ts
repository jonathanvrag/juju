import Joi from 'joi';

export const createReservationSchema = Joi.object({
  bookId: Joi.string().required().length(24).hex(),
  expirationDate: Joi.date().required().greater('now').messages({
    'date.greater': 'Expiration date must be in the future',
  }),
});

export const fulfillReservationSchema = Joi.object({
  loanDueDate: Joi.date().required().greater('now').messages({
    'date.greater': 'Loan due date must be in the future',
  }),
});
