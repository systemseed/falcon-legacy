import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import _isEmpty from 'lodash/isEmpty';
import { withDone as withServerDone } from 'react-router-server';
import Logo from './Logo';
import TopBar from './TopBar';
import MainMenu from './MainMenu';
import BasketWidget from '../../containers/BasketWidgetContainer';
import * as siteContentSettingsActions from '../../actions/siteContentSettings';
import CheckoutCardsSummary from '../../containers/CheckoutCardsSummary';
import CheckoutBasketSummary from '../../containers/CheckoutBasketSummary';
import CheckoutCardsContinueContainer from '../../containers/CheckoutCardsContinueContainer';
import CheckoutPaymentContainer from '../../containers/CheckoutPaymentContainer';

class GlobalHeader extends React.Component {

  constructor() {
    super();
    this.state = {
      isMenuCollapsed: true,
    };
  }

  componentWillMount() {
    // Load list of gifts is they haven't been
    // loaded yet.
    const { siteContentSettings, getSiteContentSettings, done } = this.props;

    if (_isEmpty(siteContentSettings)) {
      getSiteContentSettings()
        .then(done, done);
    }
  }

  mobileMenuToggle = () => {
    this.setState({ isMenuCollapsed: !this.state.isMenuCollapsed });
  };

  render = () => {
    const { siteContentSettings, location } = this.props;
    console.log(this.props);

    if (_isEmpty(siteContentSettings)) {
      return null;
    }

    let checkoutHeader = false;
    let cardsPage = false;
    let checkoutPage = false;
    switch (location.pathname) {
      case '/cards':
        cardsPage = true;
        checkoutHeader = true;
        break;
      case '/checkout':
        checkoutPage = true;
        checkoutHeader = true;
        break;
      default:
        break;
    }

    const headerCls = checkoutHeader ? ' hidden-xs hidden-sm hidden-md' : '';
    const checkoutHeaderCls = checkoutHeader ? ' hidden-lg hidden-xl' : ' hidden';

    return (
      <header className="navbar navbar-sticky">

        <TopBar
          headerLeftText={siteContentSettings.fieldConfigHeaderLeftText.value}
          headerRightText={siteContentSettings.fieldConfigHeaderRightText.value}
        />
        <div className={`container header-container${headerCls}`}>

          {/* Visible only on the mobile */}
          <div className="mobile-menu-wrapper">
            <Button
              bsStyle="link"
              className={this.state.isMenuCollapsed ? 'mobile-menu-toggle' : 'mobile-menu-toggle active'}
              onClick={this.mobileMenuToggle}
            >
              <i className="material-icons menu" />
            </Button>
          </div>

          <Logo />
          {/* <RegionSwitcher /> */}

          <MainMenu
            isMenuCollapsed={this.state.isMenuCollapsed}
            onMenuClick={this.mobileMenuToggle.bind(this)}
          />

          <div className="toolbar">
            <div className="inner">

              {/* Basket DropDown Widget */}
              <BasketWidget />
            </div>
          </div>
        </div>
        <div className={`container header-container header-container-checkout${checkoutHeaderCls}`}>
          {(cardsPage || checkoutPage) && <CheckoutCardsSummary />}
          <CheckoutBasketSummary />
          {cardsPage && <CheckoutCardsContinueContainer />}
          {checkoutPage && <CheckoutPaymentContainer />}
        </div>
      </header>
    );
  };
}

// Declare our props dependencies.
GlobalHeader.propTypes = {
  siteContentSettings: React.PropTypes.object,
  getSiteContentSettings: React.PropTypes.func,
  done: React.PropTypes.func,
  location: React.PropTypes.object,
};

// Anything in the returned object below is merged in with the props of the
// component, so we have access to store values but the component itself
// does not have to be aware of the store.
const mapStoreToProps = store => ({
  siteContentSettings: store.siteContentSettings.data,
});

const mapDispatchToProps = {
  getSiteContentSettings: siteContentSettingsActions.load,
};

export default withServerDone(connect(mapStoreToProps, mapDispatchToProps)(GlobalHeader));
