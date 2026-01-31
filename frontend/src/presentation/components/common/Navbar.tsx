import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../../../application/stores';

export function Navbar() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className='bg-gray-800 border-b border-gray-700'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          {/* Logo y navegación */}
          <div className='flex items-center space-x-8'>
            <Link to='/' className='flex items-center space-x-2'>
              <BookOpen className='h-8 w-8 text-primary-500' />
              <span className='text-xl font-bold text-gray-100'>
                Book Management
              </span>
            </Link>

            <div className='hidden md:flex space-x-4'>
              <Link
                to='/'
                className='text-gray-300 hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors'>
                Libros
              </Link>
              <Link
                to='/my-reservations'
                className='text-gray-300 hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors'>
                Mis Reservas
              </Link>
              <Link
                to='/my-loans'
                className='text-gray-300 hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors'>
                Mis Préstamos
              </Link>
            </div>
          </div>

          {/* Usuario y logout */}
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-2 text-gray-300'>
              <User className='h-5 w-5' />
              <span className='text-sm'>{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className='flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors'>
              <LogOut className='h-5 w-5' />
              <span className='text-sm'>Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
