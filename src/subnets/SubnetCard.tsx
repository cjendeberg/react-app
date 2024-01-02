import { IPv4CidrRange } from "ip-num";

interface SubnetCardProps {  
  name: string
  cidr: string
  range: IPv4CidrRange
}

function SubnetCard({name, cidr, range}: SubnetCardProps) {

  return (    
    <div className="subnetContainer">
      <div className="subnetName">{name}</div><div className="subnetCidr">{cidr}</div>
    </div>    
  );
}

export default SubnetCard;