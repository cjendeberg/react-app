//import { msalInstance } from '../index';
import { AccountInfo, IPublicClientApplication, SilentRequest } from "@azure/msal-browser";
import { IPv4CidrRange } from 'ip-num';
import { Subnet } from './Subnet';
import { AccessToken, GetTokenOptions, InteractiveBrowserCredential, TokenCredential } from '@azure/identity';
import { NetworkManagementClient } from '@azure/arm-network';



const baseUrl = 'http://localhost:4000';
const url = `${baseUrl}/subnets`;

function translateStatusToErrorMessage(status: number) {
  switch (status) {
    case 401:
      return 'Please login again.';
    case 403:
      return 'You do not have permission to view the subnet(s).';
    default:
      return 'There was an error retrieving the subnets(s). Please try again.';
  }
}

function checkStatus(response: any) {
  if (response.ok) {
    return response;
  } else {
    const httpErrorInfo = {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    };
    console.log(`log server http error: ${JSON.stringify(httpErrorInfo)}`);

    let errorMessage = translateStatusToErrorMessage(httpErrorInfo.status);
    throw new Error(errorMessage);
  }
}

function parseJSON(response: Response) {
  return response.json();
}

// eslint-disable-next-line
function delay(ms: number) {
  return function (x: any): Promise<any> {
    return new Promise((resolve) => setTimeout(() => resolve(x), ms));
  };
}

function convertToSubnetModels(data: any[]): Subnet[] {
  let subnets: Subnet[] = data.map(convertToSubnetModel);
  return subnets;
}

function convertToSubnetModel(item: any): Subnet {
  return new Subnet(item.name, item.addressPrefix, IPv4CidrRange.fromCidr(item.addressPrefix));
}

const getCredential = (account:AccountInfo) =>
{
    const credential = new InteractiveBrowserCredential({
        tenantId: account.tenantId,
        clientId: account?.idTokenClaims?.aud
      });
      return credential;
}

class BrowserCredential implements TokenCredential {
  private publicApp: IPublicClientApplication;
  private hasAuthenticated: boolean = false;

  constructor(instance:IPublicClientApplication) {
    this.publicApp = instance;
  }

  // Either confirm the account already exists in memory, or tries to parse the redirect URI values.
  async prepare(): Promise<void> {
    try {
      if (await this.publicApp.getActiveAccount()) {
        this.hasAuthenticated = true;
        return;
      }
      await this.publicApp.handleRedirectPromise();
      this.hasAuthenticated = true;
    } catch (e) {
      console.error("BrowserCredential prepare() failed", e);
    }
  }

  // Should be true if prepare() was successful.
  isAuthenticated(): boolean {
    return this.hasAuthenticated;
  }

  // If called, triggers authentication via redirection.
  async loginRedirect(scopes: string | string[]): Promise<void> {
    const loginRequest = {
      scopes: Array.isArray(scopes) ? scopes : [scopes]
    };
    await this.publicApp.loginRedirect(loginRequest);
  }

  // Tries to retrieve the token without triggering a redirection.
  async getToken(scopes: string | string[]): Promise<AccessToken> {
    if (!this.hasAuthenticated) {
      throw new Error("Authentication required");
    }

    const account = this.publicApp.getActiveAccount();
    if (!account) {
      throw new Error("Could not get active account");
    }

    const parameters: SilentRequest = {
      account: account,
      scopes: ['https://management.azure.com/user_impersonation']
    };
    
    const result = await this.publicApp.acquireTokenSilent(parameters);
    return {
      token: result.accessToken,
      //expiresOnTimestamp: result.expiresOn.getTime()
      expiresOnTimestamp: result!.expiresOn!.getTime()
    };
  }
}
export async function getSubnets(msalInstance: IPublicClientApplication) {
  //const account: any  = msalInstance.getActiveAccount();

  const credential = new BrowserCredential(msalInstance);
  await credential.prepare();
  //const credential = getCredential(account);
  
  if (!credential.isAuthenticated()) {
    await credential.loginRedirect("https://management.azure.com/user_impersonation");
  }

  const subscriptionId = "e47f2843-e9eb-4576-91e6-507ef91488b7";
  const client = new NetworkManagementClient(credential, subscriptionId);  
  const resourceGroup = "MC_firl-prod-aks-rg_firl-prod-aks_swedencentral";
  const virtualNetworkName = "aks-vnet-14396990";

  //console.log((await credential.getToken(["https://management.azure.com/user_impersonation"])));
  let resultSubnets:any = [];
  for await (const item of client.subnets.list(
    resourceGroup,
    virtualNetworkName
  )) {
    resultSubnets.push({name: item.name, addressPrefix: item.addressPrefix});
  }  
  return convertToSubnetModels(resultSubnets);

  // const response = await msalInstance.acquireTokenSilent({scopes: ["User.Read"]});
  // const headers = new Headers();
  // const bearer = `Bearer ${response.accessToken}`;
  // headers.append("Authorization", bearer);
  // const options = {
  //   method: "GET",
  //   headers: headers
  // };

  // return fetch(`${url}`, options)
  //   .then(delay(600))
  //   .then(checkStatus)
  //   .then(parseJSON)
  //   .then(convertToSubnetModels)
  //   .catch((error: TypeError) => {
  //     console.log('log client error ' + error);
  //     throw new Error(
  //       'There was an error retrieving the subnets. Please try again.'
  //     );
  //   });
};

