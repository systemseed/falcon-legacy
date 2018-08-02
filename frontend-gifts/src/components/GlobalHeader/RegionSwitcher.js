import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as regionActions from '../../actions/region';
import * as regionUtils from '../../utils/region';

class RegionSwitcher extends Component {

  state = {
    isCollapsed: true
  };

  componentWillMount() {
    const { regionSettings, getRegionSettings } = this.props;
    const { isPending, isFulfilled, isError } = regionSettings;

    // Load regional settings on client side. It will pass user IP and other
    // CDN headers to API bus to Gifts backend.
    if (typeof window !== 'undefined' && !isPending && !isFulfilled && !isError) {
      getRegionSettings();
    }
  }

  toggleDropDown = () => {
    this.setState({ isCollapsed: !this.state.isCollapsed });
  }

  showRegionSwitcher() {
    const regionSettings = this.props.regionSettings;
    const { isPending, isError } = regionSettings;

    // Regional settings are loading.
    if (isPending || isError) {
      return false;
    }
    // Switcher is disabled in site settings.
    if (!regionSettings.enable_region_switcher) {
      return false;
    }
    return true;
  }

  render() {
    if (!this.showRegionSwitcher()) {
      return null;
    }
    const regionSettings = this.props.regionSettings;
    const regions = regionSettings.regions;
    const defaultRegion = regions[0];

    const dropdownRegions = regions
      // Remove main region from dropdown.
      .filter(region => region.code !== defaultRegion.code)
      .map(region => (
        <li key={region.code}>
          <a href={region.url}>
            <img src={region.image.url} alt={region.image.alt} />
            {region.code}
          </a>
        </li>
      ));

    return (
      <div // eslint-disable-line jsx-a11y/no-static-element-interactions
        className={`lang-switcher${this.state.isCollapsed ? '' : ' open'}`}
        onClick={this.toggleDropDown}
      >
        <div className="lang-toggle">
          <img src={defaultRegion.image.url} alt={defaultRegion.image.alt} />
          <i className="material-icons arrow_drop_down" />
          <ul className="lang-dropdown">
            {dropdownRegions}
          </ul>
        </div>
      </div>
    );
  }
}


RegionSwitcher.propTypes = {
  regionSettings: PropTypes.shape({
    isPending: PropTypes.bool,
    isFulfilled: PropTypes.bool,
    isError: PropTypes.bool,
    enable_region_switcher: PropTypes.bool,
    regions: PropTypes.array
  }),
  getRegionSettings: PropTypes.func,
};

RegionSwitcher.defaultProps = {
  regionSettings: regionUtils.getDefaultRegionSettings()
};

const mapStoreToProps = store => ({
  regionSettings: store.region
});

const mapDispatchToProps = {
  getRegionSettings: regionActions.getRegionSettings,
  disablePopup: regionActions.disablePopup,
};

export default connect(mapStoreToProps, mapDispatchToProps)(RegionSwitcher);
