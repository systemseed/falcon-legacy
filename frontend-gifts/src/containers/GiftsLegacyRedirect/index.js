import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import _find from 'lodash/find';
import * as giftsActions from '../../actions/gifts';
import Loading from '../../components/Loading';
import LoadingError from '../../components/LoadingError';

// Redirect from legacy URLS like http://www.falcon.systemseed.com/charity-gift/c/goat
// where "c" is product code.
class GiftsLegacyRedirect extends React.Component {

  componentWillMount() {
    const { gifts, dispatch } = this.props;
    if (!gifts.products.length) {
      dispatch(giftsActions.loadAll());
    }
  }

  render = () => {
    const { currentGift, gifts } = this.props;

    // Display loading.
    if (gifts.isPending) {
      return <Loading big />;
    }

    if (gifts.isFulfilled && currentGift) {
      return <Redirect to={currentGift.path} />;
    }

    // Redirect if the current gift was not found.
    if (gifts.isFulfilled && !currentGift) {
      return <Redirect to="/not-found" />;
    }

    return <LoadingError type="gift" />;
  }
}


const mapStateToProps = (store, ownProps) => ({
  gifts: store.gifts,
  currentGift: _find(store.gifts.products, { code: ownProps.match.params.code.toUpperCase() }),
});

export default connect(mapStateToProps)(GiftsLegacyRedirect);
