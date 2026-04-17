import { addLinksToText } from '../../../utils/textHelpers';

export const Content = ({ content }) => {
  if (!content) return null;
  return (
    <div className="listings-details-desc mb-3">
      <div
        className="listings_details_content"
        dangerouslySetInnerHTML={{ __html: addLinksToText(content.content) }}
      />
    </div>
  );
};

export default Content;
