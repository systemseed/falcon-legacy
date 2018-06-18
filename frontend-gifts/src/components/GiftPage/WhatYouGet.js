import React from 'react';

const WhatYouGet = ({ gift }) => (
  <div className="row row-eq-height">
    <div className="col-md-6 tile-image-col-left no-gutter-sm">
      <div className="tile tile--image-section">
        <section className="fw-section tile--image-section object-fit-wrapper">
          <img
            className="object-fit-cover" src={gift.whatYouGetImage.src} alt={gift.whatYouGetImage.alt}
            title={gift.whatYouGetImage.alt}
          />
        </section>
      </div>
    </div>
    <div className="col-md-6">
      <div className="tile tile--text-section">
        <sectsion className="fw-section">
          <div className="gift-content">
            <div className="product-info">
              <h1 className="tile-gift-title tile-gift-title--what-you-get">What You Get</h1>
              <div className="tile-gift-body" dangerouslySetInnerHTML={{ __html: gift.description }} />
            </div>
          </div>
        </sectsion>
      </div>
    </div>
  </div>
);

WhatYouGet.propTypes = {
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

export default WhatYouGet;
