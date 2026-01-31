import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../application/stores';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data);
      toast.success('¡Bienvenido!');
      navigate('/');
    } catch {
      toast.error('Credenciales inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='max-w-md w-full'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-primary-500 mb-2'>
            Book Management
          </h1>
          <p className='text-gray-400'>Inicia sesión para continuar</p>
        </div>

        {/* Formulario */}
        <div className='card'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Email */}
            <div>
              <label htmlFor='email' className='label'>
                Email
              </label>
              <input
                {...register('email')}
                type='email'
                id='email'
                className={`input-field ${errors.email ? 'input-error' : ''}`}
                placeholder='tu@email.com'
                disabled={isLoading}
              />
              {errors.email && (
                <p className='error-message'>{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor='password' className='label'>
                Contraseña
              </label>
              <input
                {...register('password')}
                type='password'
                id='password'
                className={`input-field ${errors.password ? 'input-error' : ''}`}
                placeholder='••••••••'
                disabled={isLoading}
              />
              {errors.password && (
                <p className='error-message'>{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type='submit'
              className='btn-primary w-full'
              disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Link a Register */}
          <div className='mt-6 text-center'>
            <p className='text-gray-400'>
              ¿No tienes cuenta?{' '}
              <Link to='/register' className='link'>
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
