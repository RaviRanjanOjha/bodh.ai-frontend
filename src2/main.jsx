import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import ContextProvider from './context/Context.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from '@material-tailwind/react';
import { BrowserRouter } from 'react-router';

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="google id required">
    <ContextProvider>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </ContextProvider>
  </GoogleOAuthProvider>
);
