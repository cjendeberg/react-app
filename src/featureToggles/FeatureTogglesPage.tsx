import React, { useEffect, useState } from "react";
import {getFeatureToggleDiff, FeatureToggleDiff} from "./featureTogglesDiff";
import ErrorPage from "./ErrorPage";
import FeatureToggleDiffCard from "./FeatureToggleDiffCard";
import FeatureToggleDiffChoice from "./FeatureToggleDiffChoice";

function FeatureTogglesPage() {
  const environments:string[] = [
    "dev",
    "test",
    "qa",
    "intadp",
    "prod"
  ]

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [ftDiffs, setFtDiffs] = useState<never|FeatureToggleDiff[]>([]);
  const [env1, setEnv1] = useState<undefined|string>(undefined);
  const [env2, setEnv2] = useState<undefined|string>(undefined);
  const [hideGreen, setHideGreen] = useState(false);
  const [searchString, setSearchString] = useState("");

  async function clickCompare(env1:string, env2:string) {
    setEnv1(env1);
    setEnv2(env2);
  }

  const handleClick = (e:any) => {    
    setHideGreen(e.target.checked);
  }

  const handleChange = (e:any) => {    
    setSearchString(e.target.value);
  }

  useEffect(() => {
    async function loadFeatureToggleDiffs() {
      setLoading(true);
      try {
        if (env1 && env2) {
          setFtDiffs(await getFeatureToggleDiff(env1, env2));
        }
      } catch (e) {
        if (e instanceof Error) {
          setApiError(e.message);
        }
      } finally {
        setLoading(false);
      }
    }

    !loading && loadFeatureToggleDiffs();
  }, [env1, env2]);

  const filterDiffs = (input: FeatureToggleDiff[]):FeatureToggleDiff[] => {
    return input.filter((diff:FeatureToggleDiff) => {
      let result = true;
      if (hideGreen) {
        result = diff.value1 != diff.value2;
      }
      return result && diff.name.includes(searchString);
    })
  }

  return (
    <>      
      <FeatureToggleDiffChoice env1={env1} env2={env2} clickCompareFunction={clickCompare} environments={environments}/>
      <div>
        <label>
          <input type="checkbox" defaultChecked={hideGreen} onClick={handleClick} />
          Hide matching
        </label>
        <label>
          <input name="searchString"  onChange={handleChange} />       
        </label>

      </div>
      <p>{ftDiffs?.length.toString()}</p>
      <ErrorPage error={apiError} />      
      {loading ? ("Loading...") : filterDiffs(ftDiffs).map((ftDiff:FeatureToggleDiff, index:number) => (
        <div key={index} className="cols-sm">
          <FeatureToggleDiffCard name={ftDiff.name} value1={ftDiff.value1} value2={ftDiff.value2} />
        </div>
      ))}
      
    </>
  );
}

export default FeatureTogglesPage;