import {IPv4CidrRange} from "ip-num/IPRange.js";

export class Subnet {
  name: string;
  cidr: string;
  range: IPv4CidrRange ;

  constructor(name: string, cidr: string, range: IPv4CidrRange) {    
    this.name = name;
    this.cidr = cidr;
    this.range = range;
  }

  setRange(range: IPv4CidrRange): Subnet {
    this.range = range;
    return this;
  }
}
