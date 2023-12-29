import React, { useEffect, useState } from "react";
import { Subnet } from "./Subnet";
import SubnetCard from "./SubnetCard";
import { subnetApi } from "./subnetApi";
import { fillSubnetGaps } from "./fillSubnetGaps";
import { IPv4CidrRange } from "ip-num";


function SubnetsPage() {
  const [subnets, setSubnets] = useState<Subnet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSubnets() {
      setLoading(true);
      try {
        const existingSubnets = await subnetApi.get();
        const subnets:Subnet[] = fillSubnetGaps(IPv4CidrRange.fromCidr("172.29.208.0/21"), existingSubnets);
        setError("");
        setSubnets(subnets);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        }
      } finally {
        setLoading(false);
      }
    }
    loadSubnets();
  }, []);

  return (
    <>
      <p>{subnets.length.toString()}</p>
      {subnets.map((subnet:Subnet, index:number) => (
        <div key={index} className="cols-sm">
          <SubnetCard name={subnet.name} cidr={subnet.cidr} />
        </div>
      ))}
    </>
  );
}

export default SubnetsPage;