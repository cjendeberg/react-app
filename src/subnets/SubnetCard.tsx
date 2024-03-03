import { IPv4CidrRange } from "ip-num";

interface SubnetCardProps {  
  name: string
  cidr: string
  range: IPv4CidrRange
}

function SubnetCard({name, cidr, range}: SubnetCardProps) {

  return (    
    <div className="subnet-row">
      <div className="subnet-content">{name}</div><div className="subnet-content">{cidr}</div>
    </div>    
  );
}

export default SubnetCard;