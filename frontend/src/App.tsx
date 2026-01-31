import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AppRouter } from './presentation/routes/AppRouter';
import { useAuthStore } from './application/stores';

function App() {
  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <AppRouter />
      <Toaster
        position='top-right'
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            border: '1px solid #374151',
          },
        }}
      />
    </>
  );
}

export default App;
