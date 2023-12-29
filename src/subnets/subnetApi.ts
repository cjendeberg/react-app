import { IPv4CidrRange } from 'ip-num';
import { Subnet } from './Subnet';
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

const subnetApi = {
  get() {
    return fetch(`${url}`)
      .then(delay(600))
      .then(checkStatus)
      .then(parseJSON)
      .then(convertToSubnetModels)
      .catch((error: TypeError) => {
        console.log('log client error ' + error);
        throw new Error(
          'There was an error retrieving the subnets. Please try again.'
        );
      });
  },
};

export { subnetApi };