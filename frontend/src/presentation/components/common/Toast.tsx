import { Toaster } from 'sonner';

export function Toast() {
  return (
    <Toaster
      position='top-right'
      toastOptions={{
        duration: 3000,
        style: {
          background: '#1f2937',
          color: '#f9fafb',
          border: '1px solid #374151',
        },
        className: 'toast',
      }}
    />
  );
}
