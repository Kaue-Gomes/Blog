import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { AppProviders } from './providers/AppProviders';
import { initSentryRuntime } from './initSentry';
import { hydrateThemeBootstrap } from './contexts/ThemeProvider';

hydrateThemeBootstrap();

initSentryRuntime();

ReactDOM.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
