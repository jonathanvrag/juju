import { Request, Response, NextFunction } from 'express';
import { CreateBook } from '../../../application/use-cases/books/CreateBook';
import { GetBookById } from '../../../application/use-cases/books/GetBookById';
import { ListBooks } from '../../../application/use-cases/books/ListBooks';
import { UpdateBook } from '../../../application/use-cases/books/UpdateBook';
import { DeleteBook } from '../../../application/use-cases/books/DeleteBook';
import { MongoBookRepository } from '../../../infrastructure/database/mongodb/repositories/MongoBookRepository';
import { Logger } from '../../../infrastructure/logging/Logger';

export class BookController {
  private bookRepository = new MongoBookRepository();

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const createBook = new CreateBook(this.bookRepository);
      const book = await createBook.execute(req.body);

      Logger.info(`[Books] Book created: ${book.title} by ${req.user?.userId}`);

      res.status(201).json({
        status: 'success',
        data: { book },
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const getBookById = new GetBookById(this.bookRepository);
      const id = req.params.id as string;
      const book = await getBookById.execute(id);

      res.status(200).json({
        status: 'success',
        data: { book },
      });
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const listBooks = new ListBooks(this.bookRepository);
      const result = await listBooks.execute(req.query);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updateBook = new UpdateBook(this.bookRepository);
      const id = req.params.id as string;
      const book = await updateBook.execute(id, req.body);

      Logger.info(`[Books] Book updated: ${book.title} by ${req.user?.userId}`);

      res.status(200).json({
        status: 'success',
        data: { book },
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleteBook = new DeleteBook(this.bookRepository);
      const id = req.params.id as string;
      await deleteBook.execute(id);

      Logger.info(`[Books] Book deleted: ${id} by ${req.user?.userId}`);

      res.status(200).json({
        status: 'success',
        message: 'Book deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
