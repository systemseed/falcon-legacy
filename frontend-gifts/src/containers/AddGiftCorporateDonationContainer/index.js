import React from 'react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import * as giftsCorporateActions from '../../actions/gifts.corporate';
import * as basketActions from '../../actions/basket';
import AddDonationForm from '../../components/AddDonationForm';
import Loading from '../../components/Loading';
import LoadingError from '../../components/LoadingError';

class AddGiftCorporateDonationContainer extends React.Component {

  componentWillMount() {
    const { customPriceProduct, dispatch } = this.props;
    if (_isEmpty(customPriceProduct)) {
      dispatch(giftsCorporateActions.getCustomPriceProduct());
    }
  }

  addDonationSubmit = (event) => {
    const { customPriceProduct, dispatch } = this.props;
    const { router } = this.context;
    const amount = event.formData.amount;
    dispatch(
      basketActions.addCustomPriceProduct(
        customPriceProduct, amount, router
      )
    );
  };

  render() {
    const {
      customPriceProduct,
      isFulfilled,
      isPending,
      buttonLabel,
      currentCurrency } = this.props;

    if (isPending) {
      return (<Loading />);
    }

    if (isFulfilled && !_isEmpty(customPriceProduct)) {
      return (<AddDonationForm
        buttonLabel={buttonLabel}
        addDonationSubmit={this.addDonationSubmit.bind(this)}
        currentCurrency={currentCurrency}
      />);
    }

    return (<LoadingError type="donation form" />);
  }
}

AddGiftCorporateDonationContainer.propTypes = {
  currentCurrency: React.PropTypes.string,
  dispatch: React.PropTypes.func,
  customPriceProduct: React.PropTypes.object,
  isPending: React.PropTypes.bool,
  isFulfilled: React.PropTypes.bool,
  buttonLabel: React.PropTypes.string.isRequired,
};

AddGiftCorporateDonationContainer.contextTypes = {
  router: React.PropTypes.object.isRequired
};

AddGiftCorporateDonationContainer.defaultProps = {
  buttonLabel: 'Add to basket',
};

const mapStateToProps = state => ({
  currentCurrency: state.currentCurrency,
  customPriceProduct: state.giftCorporateCustomPrice.product,
  isPending: state.giftCorporateCustomPrice.isPending,
  isFulfilled: state.giftCorporateCustomPrice.isFulfilled,
});

export default connect(mapStateToProps)(AddGiftCorporateDonationContainer);
