import React from 'react';
import Sticky from 'react-stickynode';
import { Grid, Row, Col } from 'react-bootstrap';
import * as basketUtils from '../../utils/basket';
import BasketItem from './BasketItem';
import BasketItemsInCart from './BasketItemsInCart';
import AddGiftDonationContainer from '../../containers/AddGiftDonationContainer';
import CheckoutCardsButton from '../../containers/CheckoutCardsButton';
import FreeProductsOfferings from '../../containers/FreeProductsOfferings';
import BasketNav from '../BasketNav';
import BasketSummary from './BasketSummary';

const BasketWithGifts = ({ currentCurrency, products }) => {
  const basketProducts = products.map(product => (
    <BasketItem
      key={product.id}
      product={product}
      currentCurrency={currentCurrency}
    />
  ));

  return (
    <Grid>
      <div className="bg-white padding-horizontal-150-xl padding-top">
        <BasketNav />
        <h1 className="space-top">Shopping Basket</h1>

        <Row>

          <Col xs={12} sm={7} className="padding-bottom-2x sticky-bottom-boundary-basket">
            <BasketSummary
              className="basket-summary text-sm visible-xs"
              count={basketUtils.getItemsCount(products, currentCurrency)}
              total={basketUtils.getTotal(products, currentCurrency)}
              currency={currentCurrency}
            />
            <BasketItemsInCart
              className="hidden-xs"
              count={basketUtils.getItemsCount(products, currentCurrency)}
            />
            <FreeProductsOfferings className="offering--basket-page" />
            <div className="space-top-2x shopping-cart">
              {basketProducts}
            </div>
          </Col>

          <Col xs={12} sm={5} md={4} mdOffset={1} className="padding-bottom-2x">
            <aside>
              <Sticky top={114} bottomBoundary=".sticky-bottom-boundary-basket">
                <div>
                  <p className="text-md">Would you like to make a donation as well? </p>
                  <AddGiftDonationContainer />
                </div>
                <BasketSummary
                  className="basket-summary text-sm lead-md"
                  total={basketUtils.getTotal(products, currentCurrency)}
                  currency={currentCurrency}
                />

                <CheckoutCardsButton className="btn btn-primary btn-block btn-checkout space-top-none">
                  Checkout
                </CheckoutCardsButton>
              </Sticky>
            </aside>
          </Col>

        </Row>
      </div>
    </Grid>
  );
};

BasketWithGifts.propTypes = {
  currentCurrency: React.PropTypes.string,
  products: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      id: React.PropTypes.string,
      quantity: React.PropTypes.number,
      data: React.PropTypes.shape({
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
      })
    })
  ),
};

export default BasketWithGifts;
