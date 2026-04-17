import FullViewCard from "./FullViewCard";

const FulView = ({ items, fullCardProps }) => {
  return items.map((item, index) => {
    return <FullViewCard key={index} item={item} {...fullCardProps} />;
  });
};

export default FulView;
