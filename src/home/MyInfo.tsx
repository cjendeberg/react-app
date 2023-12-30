import React from 'react';
import { useIsAuthenticated } from '@azure/msal-react';
import { callMsGraph } from './graph';
import { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { loginRequest } from '../authConfig';
import { AuthenticationResult } from '@azure/msal-browser';


function MyInfo() {
  const {instance, inProgress} = useMsal();
  const [data, setData] = useState<any|null>(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);        
        await instance.initialize();  
        const accounts = instance.getAllAccounts();        
        if (accounts.length > 0) {
          instance.setActiveAccount(accounts[0]);
        }        
        const authResult: AuthenticationResult = await instance.acquireTokenSilent(loginRequest);        
        const result = await callMsGraph(authResult.accessToken);        
        setData(result);
      } catch(e) {
        if (e  instanceof Error) {
          console.log(e.message);
        }
      } finally {
        setLoading(false);
      }
    }
    
    if(!data && inProgress === InteractionStatus.None && !loading ) {
      loadData();
    }
  }, [inProgress, data, instance]);

  return (
      <div id="profile-div">
        <p><strong>Title: </strong> {data?.jobTitle}</p>
        <p><strong>Mail: </strong> {data?.mail}</p>
        <p><strong>Phone: </strong> {data?.businessPhones[0]}</p>
        <p><strong>Location: </strong> {data?.officeLocation}</p>
       </div>
  );
}

export default MyInfo;