import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import Logo from './Logo';
import TopBar from './TopBar';
import MainMenu from './MainMenu';
import RegionSwitcher from './RegionSwitcher';
import BasketWidget from '../../containers/BasketWidgetContainer';
import * as siteContentSettingsActions from '../../actions/siteContentSettings';
import _isEmpty from 'lodash/isEmpty';

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
      getSiteContentSettings().then(done, done);
    }
  }

  mobileMenuToggle = () => {
    this.setState({ isMenuCollapsed: !this.state.isMenuCollapsed });
  };

  render = () => {
    const { siteContentSettings } = this.props;

    if (_isEmpty(siteContentSettings)) {
      return null;
    }

    return (
      <header className="navbar navbar-sticky">

        <TopBar
          headerLeftText={siteContentSettings.fieldConfigHeaderLeftText.value}
          headerRightText={siteContentSettings.fieldConfigHeaderRightText.value}
        />
        <Logo />
        {/* <RegionSwitcher /> */}

        <MainMenu
          isMenuCollapsed={this.state.isMenuCollapsed}
          onMenuClick={this.mobileMenuToggle.bind(this)}
        />

        <div className="toolbar">
          <div className="inner">

            {/* Visible only on the mobile */}
            <Button
              bsStyle="link"
              className={this.state.isMenuCollapsed ? 'mobile-menu-toggle' : 'mobile-menu-toggle active'}
              onClick={this.mobileMenuToggle}
            >
              <i className="material-icons menu" />
            </Button>

            {/* Basket DropDown Widget */}
            <BasketWidget />
          </div>
        </div>

      </header>
    );
  };
}

// Declare our props dependencies.
GlobalHeader.propTypes = {
  siteContentSettings: React.PropTypes.object,
  getSiteContentSettings: React.PropTypes.func,
};

// Anything in the returned object below is merged in with the props of the
// component, so we have access to store values but the component itself
// does not have to be aware of the store.
const mapStoreToProps = (store) => ({
    siteContentSettings: store.siteContentSettings.data,
  });

const mapDispatchToProps = {
  getSiteContentSettings: siteContentSettingsActions.load,
};

export default connect(mapStoreToProps, mapDispatchToProps)(GlobalHeader);
