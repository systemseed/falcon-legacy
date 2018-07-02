import React, { PropTypes } from 'react';
import { Image } from 'react-bootstrap';

const EmailGiftCard = ({ product, card }) => {
  const friendName = card.fieldFriendsName ? card.fieldFriendsName : '...';
  // Fallback to default copy if e-card is not configured for this gift.
  const summary = (product.fieldEcardPreviewBody && product.fieldEcardPreviewBody.summary)
    ? product.fieldEcardPreviewBody.summary
    : `I've got you a very special gift - ${product.title}!`;

  const body = (product.fieldEcardPreviewBody && product.fieldEcardPreviewBody.value)
    ? product.fieldEcardPreviewBody.value
    : null;

  // Fallback to default product image.
  const image = product.ecardPreviewImage.src
    ? product.ecardPreviewImage
    : { src: product.imageUrl, alt: product.imageAlt };

  return (
    <div className="email-card">
      <h1>Dear {friendName}</h1>
      <p className="card-intro">{summary}</p>
      {image.src &&
        <div className="email-card-image-wrapper">
          <Image src={image.src} alt={image.alt} className="email-card-image" responsive />
        </div>
      }
      {body &&
        <div className="card-body" dangerouslySetInnerHTML={{ __html: body }} />
      }
      <p className="email-card-message white-space-pre-wrap">{card.fieldMessage}</p>
    </div>
  );
};

EmailGiftCard.propTypes = {
  product: PropTypes.object.isRequired,
  card: PropTypes.object.isRequired
};

export default EmailGiftCard;
