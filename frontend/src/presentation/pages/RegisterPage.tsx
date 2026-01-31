import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../application/stores';

const registerSchema = z
  .object({
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const registerUser = useAuthStore(state => state.register);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success('¡Cuenta creada exitosamente!');
      navigate('/');
    } catch {
      toast.error('Error al crear la cuenta. El email puede estar en uso.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='max-w-md w-full'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-primary-500 mb-2'>
            Book Management
          </h1>
          <p className='text-gray-400'>Crea tu cuenta</p>
        </div>

        {/* Formulario */}
        <div className='card'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Nombre */}
            <div>
              <label htmlFor='name' className='label'>
                Nombre Completo
              </label>
              <input
                {...register('name')}
                type='text'
                id='name'
                className={`input-field ${errors.name ? 'input-error' : ''}`}
                placeholder='Juan Pérez'
                disabled={isLoading}
              />
              {errors.name && (
                <p className='error-message'>{errors.name.message}</p>
              )}
            </div>

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

            {/* Confirm Password */}
            <div>
              <label htmlFor='confirmPassword' className='label'>
                Confirmar Contraseña
              </label>
              <input
                {...register('confirmPassword')}
                type='password'
                id='confirmPassword'
                className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder='••••••••'
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className='error-message'>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type='submit'
              className='btn-primary w-full'
              disabled={isLoading}>
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Link a Login */}
          <div className='mt-6 text-center'>
            <p className='text-gray-400'>
              ¿Ya tienes cuenta?{' '}
              <Link to='/login' className='link'>
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
