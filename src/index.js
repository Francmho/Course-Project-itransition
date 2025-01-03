import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Layout from './Layout';
import reportWebVitals from './reportWebVitals';
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { initReactI18next } from "react-i18next"; 

import globalES from "./translations/es/global.json";
import globalEN from "./translations/en/global.json";


i18next
  .use(initReactI18next)  // Integra React automáticamente.
  .init({
    interpolation: { escapeValue: false },  // Evita el escape por defecto (útil para React).
    resources: {
      es: { global: globalES },
      en: { global: globalEN },
    },
    lng: 'en',  // Idioma por defecto.
  });

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <I18nextProvider i18next={i18next}>
        <Layout />
      </I18nextProvider>
    </React.StrictMode>
  );


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
