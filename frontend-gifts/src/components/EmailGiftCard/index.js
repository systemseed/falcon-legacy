import React from 'react';

const EmailGiftCard = ({ product, cardConfig, card }) => {
  const friendName = card.fieldFriendsName ? card.fieldFriendsName : '...';
  const imageUrl = cardConfig.imageUrl ? cardConfig.imageUrl : product.imageUrl;
  const intro = cardConfig.fieldIntroText ? cardConfig.fieldIntroText.value : `I've got you a very special gift - ${product.title}!`;
  const productMessage = cardConfig.fieldCardMessage ? cardConfig.fieldCardMessage.value : '';
  const message = card.fieldMessage;
  // const senderName = card.fieldSenderFirstName ? card.fieldSenderFirstName : '...';

  return (
    <div className="email-card">
      <h1>Dear {friendName}</h1>
      <div className="email-card-intro" dangerouslySetInnerHTML={{ __html: intro }} />
      {imageUrl !== '' &&
        <div className="email-card-image-wrapper"><img src={imageUrl} alt={product.title} className="email-card-image" /></div>
      }
      <div className="email-card-product-message" dangerouslySetInnerHTML={{ __html: productMessage }} />
      <p className="email-card-user-message">{message}</p>
    </div>
  );
};

EmailGiftCard.defaultProps = {
  product: {},
  card: {},
  cardConfig: {}
};

export default EmailGiftCard;
