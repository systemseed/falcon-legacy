import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as regionActions from '../../actions/region';
import * as regionUtils from '../../utils/region';

class RegionPopup extends Component {

  componentWillReceiveProps(nextProps) {
    // Popup is already disabled for this user. Do nothing.
    if (nextProps.popupDisabled === regionUtils.POPUP_DISABLED) {
      return;
    }

    const regions = nextProps.regionSettings.regions;
    // No new data received. Do nothing.
    if (regions.length === this.props.regionSettings.regions.length) {
      return;
    }

    // If a user came from another region then they most likely know how to
    // swich site regions. Disable the popup for them.
    if (regionUtils.findRegionByReferrer(regions, document.referrer)) { // eslint-disable-line no-undef
      this.props.disablePopup();
    }
  }

  componentWillMount() {
    const { regionSettings, getRegionSettings } = this.props;
    const { isPending, isFulfilled, isError } = regionSettings;

    // Load regional settings on client side. It will pass user IP and other
    // CDN headers to API bus to Gifts backend.
    if (typeof window !== 'undefined' && !isPending && !isFulfilled && !isError) {
      getRegionSettings();
    }
  }

  showPopup() {
    const { regionSettings, popupDisabled } = this.props;
    const { isPending, isError } = regionSettings;

    // Check if popup was disabled in user local storage.
    // Usually it happens when user closes popup or visits the site from region
    // switcher link.
    if (popupDisabled !== regionUtils.POPUP_ENABLED) {
      return false;
    }
    // Regional settings are loading.
    if (isPending || isError) {
      return false;
    }
    // Popup is disabled in site settings.
    if (!regionSettings.enable_popup) {
      return false;
    }

    const defaultRegion = regionSettings.regions[0];
    const userRegion = regionUtils.findRegionByCode(
      regionSettings.regions,
      regionSettings.user_suggested_region
    );

    // API couldn't recognise user region.
    if (!userRegion) {
      return false;
    }
    // Current region is already a preferred user region.
    if (userRegion.code === defaultRegion.code) {
      return false;
    }
    // Popup is not configured.
    if (!regionSettings.popup_title.length || !regionSettings.popup_body.length) {
      return false;
    }

    return true;
  }

  onHide() {
    this.props.disablePopup();
  }

  render() {
    // Check if popup should be rendered for current user.
    if (!this.showPopup()) {
      return null;
    }

    const regionSettings = this.props.regionSettings;
    const defaultRegion = regionSettings.regions[0];
    const userRegion = regionUtils.findRegionByCode(
      regionSettings.regions,
      regionSettings.user_suggested_region
    );

    return (
      <Modal
        show
        onHide={this.onHide.bind(this)}
        backdrop
        dialogClassName="region-popup"
      >
        <Modal.Body>
          <h3>{regionSettings.popup_title}</h3>
          <div dangerouslySetInnerHTML={{ __html: regionSettings.popup_body }} />
          <div className="region-popup-buttons">
            <Button className="btn-block btn-secondary" onClick={this.onHide.bind(this)}>
              Continue on {defaultRegion.title}
            </Button>
            <Button bsStyle="primary" className="btn-block" href={userRegion.url}>
              Go to {userRegion.title}
            </Button>
          </div>
        </Modal.Body>

      </Modal>
    );
  }
}

RegionPopup.propTypes = {
  regionSettings: PropTypes.shape({
    isPending: PropTypes.bool,
    isFulfilled: PropTypes.bool,
    isError: PropTypes.bool,
    enable_popup: PropTypes.bool,
    regions: PropTypes.array,
    popup_title: React.PropTypes.string,
    popup_body: React.PropTypes.string,
    user_suggested_region: React.PropTypes.string
  }),
  popupDisabled: PropTypes.number,
  getRegionSettings: PropTypes.func,
  disablePopup: PropTypes.func
};

RegionPopup.defaultProps = {
  regionSettings: regionUtils.getDefaultRegionSettings(),
  popupDisabled: regionUtils.POPUP_UNKNOWN_STATE,
};

const mapStoreToProps = store => ({
  regionSettings: store.region,
  popupDisabled: store.regionPopupOff
});

const mapDispatchToProps = {
  getRegionSettings: regionActions.getRegionSettings,
  disablePopup: regionActions.disablePopup,
};

export default connect(mapStoreToProps, mapDispatchToProps)(RegionPopup);
