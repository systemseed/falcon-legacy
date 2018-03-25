import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { withDone as withServerDone } from 'react-router-server';
import _find from 'lodash/find';
import * as giftsActions from '../../actions/gifts';
import * as analyticsActions from '../../actions/analytics';
import GiftPage from '../../components/GiftPage';
import Metatags from '../../components/Metatags';
import Loading from '../../components/Loading';
import LoadingError from '../../components/LoadingError';

class GiftContainer extends React.Component {

  componentWillMount() {
    const { gifts, currentGift, dispatch, done } = this.props;
    if (!gifts.products.length) {
      dispatch(giftsActions.loadAll()).then(done, done);
    }
    else {
      dispatch(analyticsActions.ecommerceDetail(currentGift));
    }
  }

  componentWillReceiveProps({ currentGift }) {
    if (!this.props.currentGift && currentGift) {
      this.props.dispatch(analyticsActions.ecommerceDetail(currentGift));
    }
  }

  render = () => {
    const { currentGift, gifts, currentCurrency } = this.props;

    // Display loading.
    if (gifts.isPending) {
      return <Loading big />;
    }

    if (gifts.isFulfilled && currentGift) {
      return (
        <div>
          <Metatags metatags={currentGift.fieldMetatags} />
          <GiftPage
            gift={currentGift}
            currentCurrency={currentCurrency}
          />
        </div>
      );
    }

    // Redirect if the current gift was not found.
    if (gifts.isFulfilled && !currentGift) {
      return <Redirect to="/not-found" />;
    }

    return <LoadingError type="gift" />;
  }
}

GiftContainer.propTypes = {
  dispatch: React.PropTypes.func,
  done: React.PropTypes.func,
  currentCurrency: React.PropTypes.string,
  gifts: React.PropTypes.shape({
    isPending: React.PropTypes.bool,
    isFulfilled: React.PropTypes.bool,
    isError: React.PropTypes.bool,
    products: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        id: React.PropTypes.string,
        type: React.PropTypes.string,
        title: React.PropTypes.string,
        categoryId: React.PropTypes.string,
        variantType: React.PropTypes.string,
        annotation: React.PropTypes.string,
        description: React.PropTypes.string,
        price: React.PropTypes.object,
        fieldMetatags: React.PropTypes.object,
        imageUrl: React.PropTypes.string,
        imageAlt: React.PropTypes.string,
        actionImageUrl: React.PropTypes.string,
        actionImageAlt: React.PropTypes.string,
        actionDescription: React.PropTypes.string,
      })
    ),
  }),
  currentGift: React.PropTypes.shape({
    id: React.PropTypes.string,
    type: React.PropTypes.string,
    title: React.PropTypes.string,
    categoryId: React.PropTypes.string,
    variantType: React.PropTypes.string,
    annotation: React.PropTypes.string,
    description: React.PropTypes.string,
    price: React.PropTypes.object,
    fieldMetatags: React.PropTypes.object,
    imageUrl: React.PropTypes.string,
    imageAlt: React.PropTypes.string,
    actionImageUrl: React.PropTypes.string,
    actionImageAlt: React.PropTypes.string,
    actionDescription: React.PropTypes.string,
  })
};

const mapStoreToProps = (store, ownProps) => ({
  currentCurrency: store.currentCurrency,
  gifts: store.gifts,
  currentGift: _find(store.gifts.products, { path: ownProps.productUrl }),
});

export default withServerDone(connect(mapStoreToProps)(GiftContainer));
