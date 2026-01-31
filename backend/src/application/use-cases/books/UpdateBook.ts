import { Book } from '../../../domain/entities/Book';
import { IBookRepository } from '../../../domain/repositories/IBookRepository';
import { UpdateBookDto } from '../../dtos/UpdateBookDto';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ValidationError } from '../../../shared/errors/ValidationError';

export class UpdateBook {
  constructor(private bookRepository: IBookRepository) {}

  async execute(id: string, dto: UpdateBookDto): Promise<Book> {
    const existingBook = await this.bookRepository.findById(id);

    if (!existingBook) {
      throw new NotFoundError('Book not found');
    }

    if (dto.title && dto.title !== existingBook.title) {
      const titleExits = await this.bookRepository.existsByTitle(dto.title, id);
      if (titleExits) {
        throw new ValidationError('A book with this title already exists');
      }
    }

    const updatedData = {
      ...dto,
      updatedAt: new Date(),
    };

    const updatedBook = await this.bookRepository.update(id, updatedData);

    if (!updatedBook) {
      throw new NotFoundError('Book not found');
    }

    return updatedBook;
  }
}
