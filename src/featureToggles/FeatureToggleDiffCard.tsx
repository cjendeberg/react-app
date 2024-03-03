import { FeatureToggleDiff } from "./featureTogglesDiff";

function FeatureToggleDiffCard({name, value1, value2}: FeatureToggleDiff) {
  const value1Content:string = value1 == undefined ? "": value1 ? "true":"false";
  const value2Content:string = value2 == undefined ? "": value2 ? "true":"false";
  const color:string = (value1 == undefined || value2 == undefined) ? "orange" : (value1 == value2) ? "green" : "red";
  const rowClass = `ft-row-${color}`;

  return (
    <div className={rowClass}>
    <div className="ft-content">{name}</div>
    <div className="ft-content">{value1Content}</div>
    <div className="ft-content">{value2Content}</div>
    </div>
  );
}

export default FeatureToggleDiffCard;