import React from 'react';

const GiftCorporateHeroImage = ({ gift }) => (
  <section className="fw-section bg-gray padding-top-1x">
    <div className="container padding-top">
      <div className="product-gallery">
        <ul className="product-gallery-preview">
          <li className="current">
            <img src={gift.imageUrl} alt={gift.title} />
          </li>
        </ul>
      </div>
    </div>
  </section>
);

GiftCorporateHeroImage.propTypes = {
  gift: React.PropTypes.shape({
    id: React.PropTypes.string,
    type: React.PropTypes.string,
    title: React.PropTypes.string,
    categoryId: React.PropTypes.string,
    variantType: React.PropTypes.string,
    annotation: React.PropTypes.string,
    description: React.PropTypes.string,
    price: React.PropTypes.object,
    imageUrl: React.PropTypes.string,
    actionImageUrl: React.PropTypes.string,
    actionDescription: React.PropTypes.string,
  }).isRequired,
};

export default GiftCorporateHeroImage;
