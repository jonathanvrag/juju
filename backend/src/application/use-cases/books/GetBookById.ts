import { Book } from '../../../domain/entities/Book';
import { IBookRepository } from '../../../domain/repositories/IBookRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

export class GetBookById {
  constructor(private bookRepository: IBookRepository) {}

  async execute(id: string): Promise<Book> {
    const book = await this.bookRepository.findById(id);

    if (!book) {
      throw new NotFoundError('Book not found');
    }

    return book;
  }
}
