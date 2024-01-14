import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router} from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  AuthenticationResult,
  PublicClientApplication,
  EventType,
  EventMessage,
} from "@azure/msal-browser";
import { msalConfig } from './authConfig';

export const msalInstance = new PublicClientApplication(msalConfig);

//   auth: {
//     clientId: "d52a3705-876d-4180-bdc4-ce9803daaea7",
//     authority: 'https://login.microsoftonline.com/1aa636fe-838e-4bf2-abde-587d68fa3e8c',
//     redirectUri: '/'
//   }
// });

msalInstance.initialize().then(() => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
      msalInstance.setActiveAccount(accounts[0]);
  }

  msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const payload = event.payload as AuthenticationResult;
        const account = payload.account;
        msalInstance.setActiveAccount(account);
    }
  });

  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <Router>
        <App pca={msalInstance} />
      </Router>
    </React.StrictMode>
  );  
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
