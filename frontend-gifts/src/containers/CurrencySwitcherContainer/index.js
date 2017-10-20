import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as currencyAction from '../../actions/currency';
import * as currencies from '../../utils/currencies';
import CurrencySwitcher from '../../components/CurrencySwitcher';

class CurrencySwitcherContainer extends Component {

  handleChangeCurrency = currency => (e) => {
    e.preventDefault();
    this.props.dispatch(currencyAction.setCurrent(currency));
  };

  render = () => {
    const { currentCurrency } = this.props;
    return (
      <CurrencySwitcher
        currencies={currencies.getAll()}
        currentCurrency={currentCurrency}
        handleChangeCurrency={this.handleChangeCurrency}
      />
    );
  }
}

CurrencySwitcherContainer.propTypes = {
  currentCurrency: PropTypes.string,
  dispatch: PropTypes.func
};

const mapStateToProps = state => ({
  currentCurrency: state.currentCurrency,
});

export default connect(mapStateToProps)(CurrencySwitcherContainer);
