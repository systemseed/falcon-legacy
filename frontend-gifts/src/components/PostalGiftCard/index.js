import React, { PropTypes } from 'react';
import { Image } from 'react-bootstrap';

const defaultSummary = 'If you choose this postal card option, we’ll post you a printed gift card for you to personalise and send to your friend or loved one.';

const PostalGiftCard = ({ product }) => {
  // Fallback to default copy if postal card is not configured for this gift.
  const summary = (product.fieldPostalPreviewBody && product.fieldPostalPreviewBody.summary)
    ? product.fieldPostalPreviewBody.summary
    : defaultSummary;

  const body = (product.fieldPostalPreviewBody && product.fieldPostalPreviewBody.value)
    ? product.fieldPostalPreviewBody.value
    : null;

  // Fallback to default What You Get image.
  const image = product.postalPreviewImage.src
    ? product.postalPreviewImage
    : product.whatYouGetImage;

  return (
    <div className="postal-card">
      <h2>Postal Card</h2>
      <p className="card-intro">{summary}</p>
      {image.src &&
        <Image src={image.src} alt={image.alt} responsive />
      }
      {body &&
        <div className="card-body" dangerouslySetInnerHTML={{ __html: body }} />
      }
    </div>
  );
};

PostalGiftCard.propTypes = {
  product: PropTypes.object.isRequired
};

export default PostalGiftCard;
