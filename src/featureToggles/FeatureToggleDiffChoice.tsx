import { env } from "process";
import React, { useEffect, useState } from "react";

interface Props {
  env1: string | undefined
  env2: string | undefined
  clickCompareFunction: (env1:string,env2:string) => void
  environments: string[]
}

function FeatureToggleDiffChoice({env1, env2, clickCompareFunction, environments}:Props) {

  const handleSubmit = (e:any) => {
    e.preventDefault();
    clickCompareFunction(e.target.elements.env1.value, e.target.elements.env2.value);
  }

  return (    
    <form onSubmit={handleSubmit}>
      <select name="env1">
        {environments.map((environment:string, index:number) => (
          <option key={index} value={environment}>{environment}</option>
        ))}
      </select>
      <select name="env2">
      {environments.map((environment:string, index:number) => (
          <option key={index} value={environment}>{environment}</option>
        ))}
      </select>
      <button type="submit">Compare</button>
    </form>
  );
}

export default FeatureToggleDiffChoice;