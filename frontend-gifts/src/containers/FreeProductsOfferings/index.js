import React from 'react';
import { connect } from 'react-redux';
import * as basketUtils from '../../utils/basket';
import * as freeGiftsUtils from '../../utils/gifts.free';

const FreeProductsOfferings = ({ activeOfferings, className }) => (
  <div>
    {
      activeOfferings.map(offer => (
        <div className={`text-sm offering ${className}`} key={offer.id} dangerouslySetInnerHTML={{ __html: offer.message }} />
      ))
    }
  </div>
);

const mapStateToProps = state => ({
  activeOfferings: freeGiftsUtils.getOfferings(state)
});

export default connect(mapStateToProps)(FreeProductsOfferings);
