import {IPv4CidrRange} from "ip-num/IPRange.js";
import {Subnet} from "./Subnet"

function fillSubnetGaps(range:IPv4CidrRange, subnets: Subnet[]): Subnet[] {
  if (subnets.length === 1 && range.toCidrString() === subnets[0].range?.toCidrString()) {
    return subnets;
  }
  if (subnets.length === 0) {
    return [new Subnet("FREE", range.toCidrString(), range)];
  }
  const [lowRange, highRange]:IPv4CidrRange[] = range.split();
  const lowSubnets: Subnet[] = subnets.filter((subnet) => {    
    return lowRange.contains(subnet.range!);
  });
  const highSubnets: Subnet[] = subnets.filter((subnet) => {
    return highRange.contains(subnet.range!);
  });
  return [...fillSubnetGaps(lowRange, lowSubnets), ...fillSubnetGaps(highRange, highSubnets)];
}

export {fillSubnetGaps}
