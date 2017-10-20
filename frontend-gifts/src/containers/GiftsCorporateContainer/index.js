import React from 'react';
import { connect } from 'react-redux';
import * as giftsCorporateUtils from '../../utils/gifts.corporate';
import * as giftsCorporateActions from '../../actions/gifts.corporate';
import Loading from '../../components/Loading';
import LoadingError from '../../components/LoadingError';
import GiftsCorporateGrid from '../../components/GiftsCorporateGrid';

class GiftsCorporateContainer extends React.Component {

  componentWillMount() {
    if (!this.props.giftsCorporate.products.length) {
      this.props.dispatch(giftsCorporateActions.loadAll());
    }
  }

  render = () => {
    const { giftsCorporate, currentCurrency } = this.props;

    if (giftsCorporate.isPending) {
      return <Loading big />;
    }

    if (giftsCorporate.isFulfilled && giftsCorporate.products) {
      return (
        <div>
          <GiftsCorporateGrid
            gifts={giftsCorporate.products}
            currentCurrency={currentCurrency}
          />
        </div>
      );
    }

    return <LoadingError type="corporate gifts" />;
  }
}

GiftsCorporateContainer.propTypes = {
  dispatch: React.PropTypes.func,
  currentCurrency: React.PropTypes.string,
  giftsCorporate: React.PropTypes.shape({
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
        imageUrl: React.PropTypes.string,
        actionImageUrl: React.PropTypes.string,
        actionDescription: React.PropTypes.string,
      })
    ),
  }),
};

const mapStoreToProps = store => ({
  currentCurrency: store.currentCurrency,
  giftsCorporate: giftsCorporateUtils.filterByCurrency(store.giftsCorporate, store.currentCurrency),
});

export default connect(mapStoreToProps)(GiftsCorporateContainer);
