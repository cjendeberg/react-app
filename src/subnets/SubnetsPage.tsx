import React, { useEffect, useState } from "react";
import { Subnet } from "./Subnet";
import ErrorPage from "./ErrorPage"
import SubnetCard from "./SubnetCard";
import { getSubnets }  from "./subnetApi";
import { fillSubnetGaps } from "./fillSubnetGaps";
import { IPv4CidrRange } from "ip-num";
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { vnetRange } from "../config";


function SubnetsPage() {
  const [subnets, setSubnets] = useState<null|Subnet[]>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const { instance, inProgress } = useMsal();

  function compareSubnets(a: Subnet, b: Subnet) {
    const firstValue: bigint = a.range.getFirst().getValue()
    const secondValue: bigint = b.range.getFirst().getValue()
    if(firstValue < secondValue) {
      return -1;
    } else if (a.range.getFirst().getValue() > b.range.getFirst().getValue()) {
      return 1;
    } else {
      return 0;
    }
  }

  useEffect(() => {
    async function loadSubnets() {
      setLoading(true);
      try {        
        const existingSubnets: Subnet[] = await getSubnets(instance);
        const subnets:Subnet[] = fillSubnetGaps(IPv4CidrRange.fromCidr(vnetRange), existingSubnets).
          sort(compareSubnets);
        setApiError("");
        setSubnets(subnets);
      } catch (e) {
        if (e instanceof Error) {
          setApiError(e.message);
        }
      } finally {
        setLoading(false);
      }
    }

    if(!subnets && inProgress === InteractionStatus.None) {
       !loading && loadSubnets();
    }
  }, [inProgress, subnets, instance]);

  return (
    <>
      <p>{subnets?.length.toString()}</p>
      <ErrorPage error={apiError} />
      {subnets?.map((subnet:Subnet, index:number) => (
        <div key={index} className="cols-sm">
          <SubnetCard name={subnet.name} cidr={subnet.cidr} range={subnet.range} />
        </div>
      ))}
    </>
  );
}

export default SubnetsPage;