import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ConfigProvider } from './context/ConfigContext';
import { NavBar } from './components/ui/NavBar';
import { ConfigurePage } from './pages/ConfigurePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { QuestionBankPage } from './pages/QuestionBankPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <ConfigProvider>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to="/configure" replace />} />
          <Route path="/configure" element={<ConfigurePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/question-bank" element={<QuestionBankPage />} />
        </Routes>
      </ConfigProvider>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
