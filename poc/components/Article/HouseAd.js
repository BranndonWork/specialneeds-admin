const HouseAd = ({ ad }) => {
  if (!ad) return null;

  if (!ad.image) {
    return (
      <div className="house-ad">
        <a href={ad.destination_url} className="house-ad__card house-ad__card--text-only">
          <div className="house-ad__content">
            {ad.disclosure_label && (
              <span className="house-ad__label">{ad.disclosure_label}</span>
            )}
            <h4 className="house-ad__headline">{ad.title}</h4>
            <p className="house-ad__subtext">{ad.description}</p>
            <span className="house-ad__btn">{ad.cta_text}</span>
          </div>
        </a>
      </div>
    );
  }

  return (
    <div className="house-ad">
      <a
        href={ad.destination_url}
        className="house-ad__card"
        style={{ backgroundImage: `url(${ad.image})` }}
      >
        <div className="house-ad__overlay">
          <div className="house-ad__content">
            <h4 className="house-ad__headline">{ad.title}</h4>
            <p className="house-ad__subtext">{ad.description}</p>
            <span className="house-ad__btn">{ad.cta_text}</span>
          </div>
        </div>
      </a>
    </div>
  );
};

export default HouseAd;
