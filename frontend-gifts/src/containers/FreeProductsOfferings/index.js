import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
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

FreeProductsOfferings.propTypes = {
  activeOfferings: PropTypes.array,
  className: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(FreeProductsOfferings);
