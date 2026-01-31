import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import type { Book } from '../../../domain/entities';

interface BookCardProps {
  book: Book;
}

const statusConfig = {
  available: { label: 'Disponible', class: 'badge-available' },
  reserved: { label: 'Reservado', class: 'badge-reserved' },
  loaned: { label: 'Prestado', class: 'badge-loaned' },
};

export function BookCard({ book }: BookCardProps) {
  const status = statusConfig[book.status];

  return (
    <Link
      to={`/books/${book.id}`}
      className='card hover:shadow-2xl hover:border-primary-500 transition-all cursor-pointer'>
      <div className='flex justify-between items-start mb-4'>
        <div className='flex-1'>
          <h3 className='text-lg font-semibold text-gray-100 mb-1'>
            {book.title}
          </h3>
          <p className='text-sm text-gray-400 flex items-center'>
            <User className='h-4 w-4 mr-1' />
            {book.author}
          </p>
        </div>
        <span className={`badge ${status.class}`}>{status.label}</span>
      </div>

      <div className='space-y-2 text-sm text-gray-400'>
        <div className='flex items-center'>
          <Calendar className='h-4 w-4 mr-2' />
          <span>Año: {book.publicationYear}</span>
        </div>
      </div>
    </Link>
  );
}
