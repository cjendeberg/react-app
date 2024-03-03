import axios from 'axios';

interface FeatureToggle {
  name: string
  value: boolean
}

async function getFeatureFlags(environment:string):Promise<FeatureToggle[]> {
  let url:string = '';
  if (environment === 'intadp') {
    url = 'https://prod-api.intadp.sj.se/internal/featureflags/v1/'
  } else {
    url = `https://${environment}-api.adp.sj.se/public/featureflags/1.0/`
  }
  const response = await axios.get(url);
  if(response.status == 200 && response.data.items) {
    const result:FeatureToggle[] = response.data.items.map((element:any) => {
      const valueObj = JSON.parse(element.value);
      return { name: valueObj.id, value: valueObj.enabled}
    });
    return result;
  }
  return [];
}

export interface FeatureToggleDiff {
  name: string
  value1: boolean | undefined
  value2: boolean | undefined
}

export async function getFeatureToggleDiff(firstEnv:string, secondEnv: string): Promise<FeatureToggleDiff[]|undefined> {
  try {
      const result1:FeatureToggle[] = await getFeatureFlags(firstEnv);
      const result2:FeatureToggle[] = await getFeatureFlags(secondEnv);

      let sortedResult1:FeatureToggle[] = result1.sort((a,b) => {return a.name.localeCompare(b.name)});
      let sortedResult2:FeatureToggle[] = result2.sort((a,b) => {return a.name.localeCompare(b.name)});

      let result:FeatureToggleDiff[] = [];
      while (sortedResult1.length != 0 && sortedResult2.length != 0 ) {
        const name1:string = sortedResult1[0].name;
        const name2:string = sortedResult2[0].name;
        const value1:boolean = sortedResult1[0].value;
        const value2:boolean = sortedResult2[0].value;
        const compareResult:number = name1.localeCompare(name2);
        if (compareResult == 0) {
          result.push({name: name1, value1: value1, value2: value2});
          sortedResult1.shift();
          sortedResult2.shift();
        } else if (compareResult < 0) {
          result.push({name: name1, value1: value1, value2: undefined});
          sortedResult1.shift();
        } else {
          result.push({name: name2, value1: undefined, value2: value2});
          sortedResult2.shift();
        }

      }
      sortedResult1.forEach((item:FeatureToggle) => {
        result.push({name: item.name, value1: item.value, value2: undefined});
      });
      sortedResult2.forEach((item:FeatureToggle) => {
        result.push({name: item.name, value1: undefined, value2: item.value});
      })
      return result;
  } catch (e) {
      console.log(e);
      return undefined;
  }
}

