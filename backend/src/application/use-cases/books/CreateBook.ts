import { Book } from '../../../domain/entities/Book';
import { IBookRepository } from '../../../domain/repositories/IBookRepository';
import { CreateBookDto } from '../../dtos/CreateBookDto';
import { ValidationError } from '../../../shared/errors/ValidationError';

export class CreateBook {
  constructor(private bookRepository: IBookRepository) {}

  async execute(dto: CreateBookDto): Promise<Book> {
    const exists = await this.bookRepository.existsByTitle(dto.title);
    if (exists) {
      throw new ValidationError('Book with this title already exists');
    }

    const book: Book = {
      title: dto.title,
      author: dto.author,
      publicationYear: dto.publicationYear,
      status: dto.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.bookRepository.create(book);
  }
}
