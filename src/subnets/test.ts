import { fillSubnetGaps } from "./fillSubnetGaps"
import { subnetApi } from "./subnetApi"
import { Subnet } from "./Subnet";
import { IPv4CidrRange } from "ip-num";

subnetApi.get()
.then((data) => {
  const subnets:Subnet[] = data.map((subnet: any) => {
    return  new Subnet(subnet.name, subnet.cidr, IPv4CidrRange.fromCidr(subnet.cidr));
  });
  const result:Subnet[] = fillSubnetGaps(IPv4CidrRange.fromCidr("172.29.208.0/21"), subnets);
  console.log(result);
  //console.log(data);
});