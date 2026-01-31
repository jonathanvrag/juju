import { Router } from 'express';
import { BookController } from '../../http/controllers/BookController';
import { authMiddleware } from '../../http/middlewares/authMiddleware';
import { validate } from '../../http/middlewares/validationMiddleware';
import {
  createBookSchema,
  updateBookSchema,
  listBooksSchema,
} from '../../http/validators/bookValidators';

const router = Router();
const bookController = new BookController();

/**
 * @route   GET /api/books
 * @desc    List all books with pagination and filters
 * @access  Public
 */
router.get(
  '/',
  validate(listBooksSchema),
  bookController.list.bind(bookController)
);

/**
 * @route   GET /api/books/:id
 * @desc    Get book by ID
 * @access  Public
 */
router.get('/:id', bookController.getById.bind(bookController));

/**
 * @route   POST /api/books
 * @desc    Create a new book
 * @access  Private (requires authentication)
 */
router.post(
  '/',
  authMiddleware,
  validate(createBookSchema),
  bookController.create.bind(bookController)
);

/**
 * @route   PUT /api/books/:id
 * @desc    Update a book
 * @access  Private (requires authentication)
 */
router.put(
  '/:id',
  authMiddleware,
  validate(updateBookSchema),
  bookController.update.bind(bookController)
);

/**
 * @route   DELETE /api/books/:id
 * @desc    Delete a book (soft delete)
 * @access  Private (requires authentication)
 */
router.delete(
  '/:id',
  authMiddleware,
  bookController.delete.bind(bookController)
);

export default router;
