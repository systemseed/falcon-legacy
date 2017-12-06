import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import * as basketUtils from '../../utils/basket';
import BasketItem from './BasketItem';
import BasketItemsInCart from './BasketItemsInCart';
import BasketTotal from '../BasketTotal';
import AddGiftDonationContainer from '../../containers/AddGiftDonationContainer';
import CheckoutButton from '../../containers/CheckoutButton';
import FreeProductsOfferings from '../../containers/FreeProductsOfferings';

const BasketWithGifts = ({ currentCurrency, products }) => {
  const basketProducts = products.map(product => (
    <BasketItem
      key={product.id}
      product={product}
      currentCurrency={currentCurrency}
    />
  ));

  return (
    <Grid className="padding-top-3x">
      <h1 className="space-top-half">Shopping Basket</h1>

      <Row className="padding-top">

        <Col sm={8} className="padding-bottom-2x">

          <BasketItemsInCart
            count={basketUtils.getItemsCount(products, currentCurrency)}
          />

          <FreeProductsOfferings className="offering--basket-page" />

          <div className="shopping-cart">
            {basketProducts}
          </div>

          <div className="">
            <p className="text-gray text-sm">Would you like to make a donation as well? </p>
            <AddGiftDonationContainer />
          </div>
        </Col>

        <Col md={3} mdOffset={1} sm={4} className="padding-bottom-2x">
          <aside>
            <h3 className="toolbar-title">Basket total:</h3>
            <h4 className="amount">
              <BasketTotal
                total={basketUtils.getTotal(products, currentCurrency)}
                currentCurrency={currentCurrency}
              />
            </h4>

            <CheckoutButton />
          </aside>
        </Col>

      </Row>
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
