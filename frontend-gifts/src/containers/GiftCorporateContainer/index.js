import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { withDone as withServerDone } from 'react-router-server';
import _find from 'lodash/find';
import * as giftsCorporateActions from '../../actions/gifts.corporate';
import * as analyticsActions from '../../actions/analytics';
import GiftCorporatePage from '../../components/GiftCorporatePage';
import Metatags from '../../components/Metatags';
import Loading from '../../components/Loading';
import LoadingError from '../../components/LoadingError';

class GiftCorporateContainer extends React.Component {

  componentWillMount() {
    const { giftsCorporate, dispatch, currentGiftCorporate, done } = this.props;
    if (!giftsCorporate.products.length) {
      dispatch(giftsCorporateActions.loadAll()).then(done, done);
    }
    else {
      dispatch(analyticsActions.ecommerceDetail(currentGiftCorporate));
    }
  }

  componentWillReceiveProps({ currentGiftCorporate }) {
    if (!this.props.currentGiftCorporate && currentGiftCorporate) {
      this.props.dispatch(analyticsActions.ecommerceDetail(currentGiftCorporate));
    }
  }

  render = () => {
    const { currentGiftCorporate, giftsCorporate, currentCurrency } = this.props;

    // Display loading.
    if (giftsCorporate.isPending) {
      return <Loading big />;
    }

    if (giftsCorporate.isFulfilled && currentGiftCorporate) {
      return (
        <div>
          <Metatags metatags={currentGiftCorporate.fieldMetatags} />
          <GiftCorporatePage
            giftCorporate={currentGiftCorporate}
            currentCurrency={currentCurrency}
          />
        </div>
      );
    }

    // Redirect if the current gift was not found.
    if (giftsCorporate.isFulfilled && !currentGiftCorporate) {
      return <Redirect to="/not-found" />;
    }

    return <LoadingError type="corporate gift" />;
  }
}

GiftCorporateContainer.propTypes = {
  productUrl: React.PropTypes.string.isRequired,
  dispatch: React.PropTypes.func,
  currentCurrency: React.PropTypes.string,
  giftsCorporate: React.PropTypes.shape({
    isPending: React.PropTypes.bool,
    isFulfilled: React.PropTypes.bool,
    isError: React.PropTypes.bool,
    products: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        id: React.PropTypes.string,
        path: React.PropTypes.string,
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
      })
    ),
  }),
  currentGiftCorporate: React.PropTypes.shape({
    id: React.PropTypes.string,
    path: React.PropTypes.string,
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
  })
};

const mapStoreToProps = (store, ownProps) => ({
  currentCurrency: store.currentCurrency,
  giftsCorporate: store.giftsCorporate,
  currentGiftCorporate: _find(store.giftsCorporate.products, { path: ownProps.productUrl }),
});

export default withServerDone(connect(mapStoreToProps)(GiftCorporateContainer));
