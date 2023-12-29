interface SubnetCardProps {  
  name: string
  cidr: string
}

function SubnetCard({name, cidr}: SubnetCardProps) {
  return (
    <p>{name}: {cidr}</p>
  );
}

export default SubnetCard;