import { IBookRepository } from '../../../domain/repositories/IBookRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

export class DeleteBook {
  constructor(private bookRepository: IBookRepository) {}

  async execute(id: string): Promise<void> {
    const book = await this.bookRepository.findById(id);

    if (!book) {
      throw new NotFoundError('Book not found');
    }

    const deleted = await this.bookRepository.delete(id);

    if (!deleted) {
      throw new NotFoundError('Book not found');
    }
  }
}
