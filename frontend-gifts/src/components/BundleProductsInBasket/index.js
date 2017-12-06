import React from 'react';

// Output products in bundle on basket page.
const BundleProductsInBasket = ({ bundle, currency }) => {
  // Make sure it is a bundle.
  if (bundle.variantType !== 'bundle') {
    return null;
  }

  return (
    <div>
      <p className="basket-bundle-label">With this bundle you get the following gifts:</p>
      <div className="basket-bundle-container">
        {bundle.giftsInBundle.map(product => (
          <div className="cart-item cart-item--bundle" key={product.id}>
            <span className="item-thumb">
              <img src={product.imageUrl} alt={product.imageUrlAlt} />
            </span>
            <div className="item-details">{product.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BundleProductsInBasket;
