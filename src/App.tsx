import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { useTheme } from './Context/ThemeContext';
import AppRouter from './Routers';

function App() {
  const { mode } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#0ea5e9', // Sky-500
          borderRadius: 12,
          fontFamily: 'Inter, system-ui, sans-serif',
        },
      }}
    >
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={mode === 'dark' ? 'dark' : 'light'}
        />
        <AppRouter />
      </Router>
    </ConfigProvider>
  );
}

export default App;
