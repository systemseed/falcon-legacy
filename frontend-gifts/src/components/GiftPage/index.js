import React from 'react';
import * as productUtils from '../../utils/products';
import AddToBasketButton from '../AddToBasketButton';
import BuyNowButton from '../BuyNowButton';
import ProductPrice from '../ProductPrice';
import BundleProductsViewContainer from '../../containers/BundleProductsViewContainer';

const GiftPage = ({ gift, currentCurrency }) => (
  <div className="container tiles-container">
    <div className="bg-white">

      {/* primary content */}
      <div className="row row-eq-height">
        <div className="col-md-6 tile-image-col-left no-gutter-sm">
          <div className="tile tile--image-section">
            <section className="fw-section tile--image-section object-fit-wrapper">
              <img className="object-fit-cover" src={gift.imageUrl} alt={gift.imageAlt} title={gift.imageAlt} />
            </section>
          </div>
        </div>
        <div className="col-md-6">
          <div className="tile tile--text-section tile--text-section--primary">
            <section className="fw-section">
              <div className="gift-content">
                <div className="product-info">
                  <h1 className="tile-gift-title">{gift.title}</h1>
                  <div className="tile-gift-price">
                    <ProductPrice
                      price={productUtils.getPrice(gift, currentCurrency)}
                      currentCurrency={currentCurrency}
                    />
                  </div>
                  <div className="tile-gift-body" dangerouslySetInnerHTML={{ __html: gift.annotation }} />

                  <div className="tile-gift-cta-buttons">
                    <div className="row">
                      <div className="col-md-6 tile-add-to-basket-button-col">
                        <AddToBasketButton product={gift} />
                      </div>
                      <div className="col-md-6 gift-buy-now-col">
                        <BuyNowButton product={gift} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      {/* end primary content */}

      {/* gift in action */}
      <div className="row row-eq-height">
        <div className="col-md-push-6 col-md-6 tile-image-col-right no-gutter-sm">
          <div className="tile tile--image-section">
            <section className="fw-section tile--image-section object-fit-wrapper">
              <img
                className="object-fit-cover" src={gift.actionImageUrl} alt={gift.actionImageAlt}
                title={gift.actionImageAlt}
              />
            </section>
          </div>
        </div>
        <div className="col-md-pull-6 col-md-6">
          <div className="tile tile--text-section">
            <section className="fw-section">
              <div className="gift-content">
                <div className="product-info">
                  <h1 className="tile-gift-title tile-gift-title--in-action">Gift in action</h1>
                  <div className="tile-gift-body" dangerouslySetInnerHTML={{ __html: gift.actionDescription }} />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      {/* end gift in action */}

      {/* what you get */}
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
            <section className="fw-section">
              <div className="gift-content">
                <div className="product-info">
                  <h1 className="tile-gift-title tile-gift-title--what-you-get">What You Get</h1>
                  <div className="tile-gift-body" dangerouslySetInnerHTML={{ __html: gift.description }} />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      {/* end what you get */}

      {/* In this bundle */}
      <div className="padding-horizontal-150-xl">
        <BundleProductsViewContainer bundle={gift} />
      </div>
      {/* end In this bundle */}

      {/* bottom CTAs */}
      <div className="tile tile--text-section">
        <div className="col-md-6">
          <section className="fw-section">
            <div className="gift-content">
              <div className="product-info">
                <h1 className="tile-gift-title">{gift.title}</h1>
                <div className="tile-gift-price tile-gift-price--bottom">
                  <ProductPrice
                    price={productUtils.getPrice(gift, currentCurrency)}
                    currentCurrency={currentCurrency}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="col-md-6">
          <div className="tile-gift-cta-buttons tile-gift-cta-buttons--bottom">
            <div className="row">
              <div className="col-md-6 tile-add-to-basket-button-col">
                <AddToBasketButton product={gift} />
              </div>
              <div className="col-md-6 gift-buy-now-col">
                <BuyNowButton product={gift} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row row-eq-height" />
      {/* end bottom CTAs */}


      {/* <GiftTabs gift={gift}/> */}
    </div>
  </div>
);

GiftPage.propTypes = {
  currentCurrency: React.PropTypes.string.isRequired,
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
    imageAlt: React.PropTypes.string,
    actionImageUrl: React.PropTypes.string,
    actionImageAlt: React.PropTypes.string,
    actionDescription: React.PropTypes.string,
  }).isRequired,
};

export default GiftPage;
