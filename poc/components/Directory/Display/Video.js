const _displayVideoIframe = (url) => {
  if (url) {
    return (
      <div className="video-iframe-wrapper">
        <div className="fit-iframe">
          <iframe
            width="100%"
            height="100%"
            src={url}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export const Video = ({ video }) => {
  if (!video) return null;
  return (
    <div className="listings-widget listings_generic_details listing-video">
      <h3 className="listings-widget-video">Video</h3>
      {_displayVideoIframe(video)}
    </div>
  );
};

export default Video;
