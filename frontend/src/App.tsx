import { AppRouter } from './presentation/routes/AppRouter';
import { Toast } from './presentation/components/common/Toast';

function App() {
  return (
    <>
      <Toast />
      <AppRouter />
    </>
  );
}

export default App;
