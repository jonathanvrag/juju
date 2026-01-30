import { Book } from '../../../../domain/entities/Book';
import {
  IBookRepository,
  ListBooksQuery,
  PaginatedResult,
} from '../../../../domain/repositories/IBookRepository';
import { BookModel } from '../models/BookModel';

export class MongoBookRepository implements IBookRepository {
  async create(book: Book): Promise<Book> {
    const createdBook = await BookModel.create(book);
    return this.toEntity(createdBook);
  }

  async findById(id: string): Promise<Book | null> {
    const book = await BookModel.findOne({ _id: id, deletedAt: null });
    return book ? this.toEntity(book) : null;
  }

  async findAll(query: ListBooksQuery): Promise<PaginatedResult<Book>> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const filter: any = {
      deletedAt: null,
    };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      BookModel.find(filter).sort(sort).skip(skip).limit(limit),
      BookModel.countDocuments(filter),
    ]);

    return {
      data: books.map(book => this.toEntity(book)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, book: Partial<Book>): Promise<Book | null> {
    const updatedBook = await BookModel.findByIdAndUpdate(
      { _id: id, deletedAt: null },
      { $set: book },
      { new: true }
    );
    return updatedBook ? this.toEntity(updatedBook) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await BookModel.findByIdAndDelete(id);
    return result !== null;
  }

  async existsByTitle(title: string, excludeId?: string): Promise<boolean> {
    const query: any = {
      title: { $regex: new RegExp(`^${title}$`, 'i') },
      deletedAt: null,
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const book = await BookModel.findOne(query);
    return book !== null;
  }

  private toEntity(bookDoc: any): Book {
    return {
      id: bookDoc._id.toString(),
      title: bookDoc.author,
      author: bookDoc.author,
      publicationYear: bookDoc.publicationYear,
      status: bookDoc.status,
      createdAt: bookDoc.createdAt,
      updatedAt: bookDoc.updatedAt,
      deletedAt: bookDoc.deletedAt,
    };
  }
}
