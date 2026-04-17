import useAd from "@hooks/useAd";
import HouseAd from "./HouseAd";

const AdUnit = ({ slot }) => {
  const ad = useAd(slot);
  if (!ad) return null;

  return (
    <div className="in-content-ad">
      <HouseAd ad={ad} />
    </div>
  );
};

export default AdUnit;
