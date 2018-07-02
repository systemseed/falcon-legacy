import React from 'react';

const InfoCard = ({ title, description, imageUrl }) => (
  <div className="category-tile">
    <img className="info-card-image--mobile" src={imageUrl} alt="Order" />
    <div className="inner">
      <div className="column space-bottom-2x">
        <h3 className="space-bottom-half">
          {title}
        </h3>
        {description}
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
