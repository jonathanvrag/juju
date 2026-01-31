import {
  IBookRepository,
  PaginatedResult,
} from '../../../domain/repositories/IBookRepository';
import { Book } from '../../../domain/entities/Book';
import { ListBooksQueryDto } from '../../dtos/ListBooksQueryDto';

export class ListBooks {
  constructor(private bookReporsitory: IBookRepository) {}

  async execute(query: ListBooksQueryDto): Promise<PaginatedResult<Book>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    const queryWithDefaults = {
      page,
      limit,
      search: query.search,
      status: query.status,
      sortBy,
      sortOrder,
    };

    return await this.bookReporsitory.findAll(queryWithDefaults);
  }
}
