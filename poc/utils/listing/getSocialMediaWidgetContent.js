function getSocialMediaWidgetContent(content) {
  const socialLinks = {
    title: "Social Links",
    content: [],
  };
  if (content?.social_media?.facebook) {
    socialLinks.content.push(
      <>
        <i className="bx bxl-facebook"></i>
        <a href={content?.social_media?.facebook} target="_blank" rel="noreferrer">
          Visit on Facebook
        </a>
      </>
    );
  }
  if (content?.social_media?.twitter) {
    socialLinks.content.push(
      <>
        <i className="bx bxl-twitter"></i>
        <a href={content?.social_media?.twitter} target="_blank" rel="noreferrer">
          Visit on Twitter
        </a>
      </>
    );
  }
  if (content?.social_media?.instagram) {
    socialLinks.content.push(
      <>
        <i className="bx bxl-instagram"></i>
        <a href={content?.social_media?.instagram} target="_blank" rel="noreferrer">
          Visit on Instagram
        </a>
      </>
    );
  }
  if (content?.social_media?.youtube) {
    socialLinks.content.push(
      <>
        <i className="bx bxl-youtube"></i>
        <a href={content?.social_media?.youtube} target="_blank" rel="noreferrer">
          Visit on YouTube
        </a>
      </>
    );
  }
  if (content?.social_media?.whatsapp) {
    socialLinks.content.push(
      <>
        <i className="bx bxl-whatsapp"></i>
        <a
          href={`https://wa.me/${content?.social_media?.whatsapp}`}
          target="_blank"
          rel="noreferrer"
        >
          Visit on WhatsApp
        </a>
      </>
    );
  }
  if (content?.social_media?.pinterest) {
    socialLinks.content.push(
      <>
        <i className="bx bxl-pinterest"></i>
        <a href={content?.social_media?.pinterest} target="_blank" rel="noreferrer">
          Visit on Pinterest
        </a>
      </>
    );
  }
  if (socialLinks.content.length > 0) {
    return socialLinks;
  }
  return null;
}
export default getSocialMediaWidgetContent;
