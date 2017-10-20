import React from 'react';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import * as giftsActions from '../../actions/gifts';
import * as basketActions from '../../actions/basket';
import AddDonationForm from '../../components/AddDonationForm';
import Loading from '../../components/Loading';
import LoadingError from '../../components/LoadingError';

class AddGiftDonationContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
    };
  }
  componentWillMount() {
    const { customPriceProduct, dispatch } = this.props;
    if (_isEmpty(customPriceProduct)) {
      dispatch(giftsActions.getCustomPriceProduct());
    }
  }

  addDonationSubmit = (event) => {
    const { customPriceProduct, dispatch } = this.props;
    const amount = event.formData.amount;
    dispatch(
      basketActions.addCustomPriceProduct(customPriceProduct, amount)
    );
    // Clear the field after form submition.
    this.setState({
      formData: {},
    });
  };

  render() {
    const { customPriceProduct, isFulfilled, isPending, currentCurrency } = this.props;

    if (isPending) {
      return (<Loading />);
    }

    if (isFulfilled && !_isEmpty(customPriceProduct)) {
      return (<AddDonationForm
        buttonLabel={this.props.buttonLabel}
        addDonationSubmit={this.addDonationSubmit.bind(this)}
        currentCurrency={currentCurrency}
        formData={this.state.formData}
      />);
    }

    return (<LoadingError type="add donation form" />);
  }
}

AddGiftDonationContainer.propTypes = {
  currentCurrency: React.PropTypes.string,
  dispatch: React.PropTypes.func,
  customPriceProduct: React.PropTypes.object,
  isPending: React.PropTypes.bool,
  isFulfilled: React.PropTypes.bool,
  buttonLabel: React.PropTypes.string.isRequired,
};

AddGiftDonationContainer.defaultProps = {
  buttonLabel: 'Add Donation',
};

const mapStateToProps = state => ({
  currentCurrency: state.currentCurrency,
  customPriceProduct: state.giftCustomPrice.product,
  isPending: state.giftCustomPrice.isPending,
  isFulfilled: state.giftCustomPrice.isFulfilled,
});

export default connect(mapStateToProps)(AddGiftDonationContainer);
