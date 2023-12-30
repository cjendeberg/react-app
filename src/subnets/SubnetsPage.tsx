import React, { useEffect, useState } from "react";
import { Subnet } from "./Subnet";
import ErrorPage from "./ErrorPage"
import SubnetCard from "./SubnetCard";
import { getSubnets }  from "./subnetApi";
import { fillSubnetGaps } from "./fillSubnetGaps";
import { IPv4CidrRange } from "ip-num";
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";


function SubnetsPage() {
  const [subnets, setSubnets] = useState<null|Subnet[]>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const { instance, inProgress } = useMsal();

  useEffect(() => {
    async function loadSubnets() {
      setLoading(true);
      try {        
        const existingSubnets: Subnet[] = await getSubnets(instance);
        const subnets:Subnet[] = fillSubnetGaps(IPv4CidrRange.fromCidr("172.29.208.0/21"), existingSubnets);
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
          <SubnetCard name={subnet.name} cidr={subnet.cidr} />
        </div>
      ))}
    </>
  );
}

export default SubnetsPage;