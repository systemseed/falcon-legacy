import React from 'react';

const InfoCard = ({ title, description, imageUrl }) => (
  <div className="category-tile">
    <div className="info-card__image-container">
      <img className="info-card-image--mobile" src={imageUrl} alt="Order" />
    </div>
    <div className="inner">
      <div className="column space-bottom-2x">
        <h3 className="space-bottom-half">
          {title}
        </h3>
        <div dangerouslySetInnerHTML={{ __html: description }} />
      </div>

      <div className="column column--info-card-image">
        <div className="category-thumb">
          <img src={imageUrl} alt="Order" />
        </div>
      </div>
    </div>
  </div>
);

InfoCard.propTypes = {
  title: React.PropTypes.string,
  description: React.PropTypes.string,
  imageUrl: React.PropTypes.string,
};


export default InfoCard;
