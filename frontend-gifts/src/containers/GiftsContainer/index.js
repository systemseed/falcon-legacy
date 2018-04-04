import React from 'react';
import { connect } from 'react-redux';
import { withDone as withServerDone } from 'react-router-server';
import _find from 'lodash/find';

import * as giftsActions from '../../actions/gifts';
import * as giftUtils from '../../utils/gifts';
import Loading from '../../components/Loading';
import LoadingError from '../../components/LoadingError';
import GiftsFilter from '../../components/GiftsFilter';
import GiftsGrid from '../../components/GiftsGrid';
import Metatags from '../../components/Metatags';

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
      categoryName
    } = this.props;

    const category = _find(gifts.categories, cat => cat.path === `/category/${categoryName}`);
    let categoryId;
    if (category) {
      categoryId = category.id;
    }

    const giftsFiltered = giftUtils.filterByCategory(gifts, categoryId);

    if (giftsFiltered.isPending) {
      return <Loading big />;
    }

    if (giftsFiltered.isFulfilled && giftsFiltered.products) {
      return (
        <div>
          {category && <Metatags metatags={category.metatags} />}
          <GiftsFilter
            categories={giftsFiltered.categories}
            categoryId={categoryId}
          />
          <GiftsGrid
            gifts={giftsFiltered.products}
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
  categoryName: React.PropTypes.string,
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
        name: React.PropTypes.string,
        path: React.PropTypes.string,
        metatags: React.PropTypes.object
      })
    ),
  }),
  currentCurrency: React.PropTypes.string,
  loadAllGifts: React.PropTypes.func,
  done: React.PropTypes.func,
};

// Anything in the returned object below is merged in with the props of the
// component, so we have access to store values but the component itself
// does not have to be aware of the store.
const mapStoreToProps = store => ({
  currentCurrency: store.currentCurrency,
  // Filter out products by the current site currency.
  gifts: giftUtils.filterByCurrency(
    store.gifts,
    store.currentCurrency
  )
});

const mapDispatchToProps = {
  loadAllGifts: giftsActions.loadAll,
};

// This is where we make our component subscribe to store update.
// The final react component is actually a connect component that wraps our own
// component. .
// When we add a product to the store react rerenders GiftsContainer
// and all it's children.
export default withServerDone(connect(mapStoreToProps, mapDispatchToProps)(GiftsContainer));
