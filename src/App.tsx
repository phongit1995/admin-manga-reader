import 'src/global.css';

import { useScrollToTop } from '@hooks';

import { ThemeProvider } from 'src/theme/theme-provider';
import { ToastContainer } from 'react-toastify';


// ----------------------------------------------------------------------

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  useScrollToTop();

  return (
    <ThemeProvider>
      {children}
      <ToastContainer />
    </ThemeProvider>
  );
}

