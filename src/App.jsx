import BaseTemplate from './base-template';
import ScrollToTop from './components/scroll';
import { ToastContainer } from 'react-toastify';

function App() {

  return (
  <> 
    <ScrollToTop />
      <BaseTemplate />
      <ToastContainer />
      </>
  );
}

export default App;
