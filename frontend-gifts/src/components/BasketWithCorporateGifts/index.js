import React from 'react';
import Sticky from 'react-stickynode';
import { Grid, Row, Col } from 'react-bootstrap';
import * as basketUtils from '../../utils/basket';
import BasketItem from './BasketItem';
import BasketItemsInCart from '../BasketWithGifts/BasketItemsInCart';
import CheckoutButton from '../../containers/CheckoutButton';
import BasketNav from '../BasketNav';
import BasketSummary from '../BasketWithGifts/BasketSummary';

const BasketWithCorporateGifts = ({ currentCurrency, products }) => {
  const basketProducts = products.map(product => (
    <BasketItem
      key={product.id}
      product={product}
      currentCurrency={currentCurrency}
    />
  ));

  return (
    <Grid className="padding-top">
      <BasketNav />
      <h1 className="space-top">Shopping Basket</h1>

      <Row>

        <Col sm={8} className="padding-bottom-2x sticky-bottom-boundary-basket">

          <BasketSummary
            className="text-sm visible-xs"
            count={basketUtils.getItemsCount(products, currentCurrency)}
            total={basketUtils.getTotal(products, currentCurrency)}
            currency={currentCurrency}
          />
          <BasketItemsInCart
            className="hidden-xs"
            count={basketUtils.getItemsCount(products, currentCurrency)}
          />

          <div className="space-top-2x shopping-cart">
            {basketProducts}
          </div>

        </Col>

        <Col md={3} mdOffset={1} sm={4} className="padding-bottom-2x">
          <aside>
            <Sticky top={114} bottomBoundary=".sticky-bottom-boundary-basket">
              <BasketSummary
                className="text-sm lead-md"
                total={basketUtils.getTotal(products, currentCurrency)}
                currency={currentCurrency}
              />

              <CheckoutButton className="btn btn-primary btn-block space-top-none">
                Checkout
              </CheckoutButton>
            </Sticky>
          </aside>
        </Col>

      </Row>
    </Grid>
  );
};

BasketWithCorporateGifts.propTypes = {
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

export default BasketWithCorporateGifts;
