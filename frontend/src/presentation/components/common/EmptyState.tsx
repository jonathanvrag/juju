import { BookOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className='flex flex-col items-center justify-center min-h-100 text-center'>
      <BookOpen className='h-16 w-16 text-gray-600 mb-4' />
      <h3 className='text-xl font-semibold text-gray-300 mb-2'>{title}</h3>
      <p className='text-gray-500'>{description}</p>
    </div>
  );
}
