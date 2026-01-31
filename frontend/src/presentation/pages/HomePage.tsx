import { useAuthStore } from '../../application/stores';

export function HomePage() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold text-primary-500 mb-4'>
          ¡Bienvenido, {user?.name}!
        </h1>
        <p className='text-gray-400 mb-8'>Has iniciado sesión correctamente</p>

        <button onClick={logout} className='btn-danger'>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
