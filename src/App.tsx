import BaseTemplate from './base-template';
import ScrollToTop from './components/scroll';
import { ToastContainer } from 'react-toastify';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

function App() {

  const queryClient = new QueryClient()


  return (
    <QueryClientProvider client={queryClient}>
    <ScrollToTop />
      <BaseTemplate />
      <ToastContainer />
    </QueryClientProvider>
  );
}

export default App;
