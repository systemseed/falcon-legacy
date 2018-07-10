import React from 'react';
import { connect } from 'react-redux';
import CardsBackButton from '../CardsBackButton';

const CheckoutNav = ({ basketType }) => (
  <div className="cards-nav">
    { basketType === 'gift' &&
      <CardsBackButton />
    }
  </div>
);

CheckoutNav.propTypes = {
  basketType: React.PropTypes.string,
};

const mapStateToProps = state => ({
  basketType: state.basket.type,
});

export default connect(mapStateToProps)(CheckoutNav);
