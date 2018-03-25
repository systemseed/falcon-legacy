import React from 'react';
import { connect } from 'react-redux';
import { withDone as withServerDone } from 'react-router-server';

import * as giftsActions from '../../actions/gifts';
import * as giftUtils from '../../utils/gifts';
import Loading from '../../components/Loading';
import LoadingError from '../../components/LoadingError';
import GiftsFilter from '../../components/GiftsFilter';
import GiftsGrid from '../../components/GiftsGrid';

class GiftsContainer extends React.Component {

  componentWillMount() {
    // Load list of gifts is they haven't been
    // loaded yet.
    const { gifts, loadAllGifts, done } = this.props;
    if (!gifts.products.length) {
      loadAllGifts().then(done, done);
    }
  }

  render = () => {
    const {
      gifts,
      currentCurrency,
      filter,
      filterClick,
      removeFilterClick
    } = this.props;

    if (gifts.isPending) {
      return <Loading big />;
    }

    if (gifts.isFulfilled && gifts.products) {
      return (
        <div>
          <GiftsFilter
            categories={gifts.categories}
            filter={filter}
            filterClick={filterClick}
            removeFilterClick={removeFilterClick}
          />
          <GiftsGrid
            gifts={gifts.products}
            currentCurrency={currentCurrency}
          />
        </div>
      );
    }

    return <LoadingError type="gifts" />;
  }
}

// Declare our props dependencies.
GiftsContainer.propTypes = {
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
        imageUrl: React.PropTypes.string,
        imageAlt: React.PropTypes.string,
        actionImageUrl: React.PropTypes.string,
        actionImageAlt: React.PropTypes.string,
        actionDescription: React.PropTypes.string,
      })
    ),
    categories: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        id: React.PropTypes.string,
        name: React.PropTypes.string
      })
    ),
  }),
  currentCurrency: React.PropTypes.string,
  filter: React.PropTypes.shape({
    isFiltered: React.PropTypes.bool,
    categoryId: React.PropTypes.string,
  }),
  filterClick: React.PropTypes.func,
  removeFilterClick: React.PropTypes.func,
  loadAllGifts: React.PropTypes.func,
  done: React.PropTypes.func,
};

// Anything in the returned object below is merged in with the props of the
// component, so we have access to store values but the component itself
// does not have to be aware of the store.
const mapStoreToProps = (store) => {
  // Filter out products by the current site currency.
  const gifts = giftUtils.filterByCurrency(
    store.gifts,
    store.currentCurrency
  );

  return {
    currentCurrency: store.currentCurrency,
    gifts: giftUtils.filterByCategory(gifts, store.giftsFilter),
    filter: store.giftsFilter,
  };
};

const mapDispatchToProps = {
  filterClick: giftsActions.setFilterByCategory,
  removeFilterClick: giftsActions.removeFilterByCategory,
  loadAllGifts: giftsActions.loadAll,
};

// This is where we make our component subscribe to store update.
// The final react component is actually a connect component that wraps our own
// component. .
// When we add a product to the store react rerenders GiftsContainer
// and all it's children.
export default withServerDone(connect(mapStoreToProps, mapDispatchToProps)(GiftsContainer));
