import React from 'react';
import { connect } from 'react-redux';

const GlobalFooter = ({ siteContentSettings }) => (
  <footer className="footer space-top-2x">
    <div className="column">
      {siteContentSettings.fieldConfigFooterLeftText &&
        <div dangerouslySetInnerHTML={{ __html: siteContentSettings.fieldConfigFooterLeftText.value }} />
      }
    </div>
    <div className="column">
      <h3 className="widget-title">
        Payment Methods
            <small>We support one of the following payment methods.</small>
      </h3>
      <div className="cards">
        <img src="/images/cards.png" alt="Payment methods" />
      </div>
    </div>

  </footer>
);

GlobalFooter.propTypes = {
  siteContentSettings: React.PropTypes.object,
};

const mapStoreToProps = store => ({
  siteContentSettings: store.siteContentSettings.data,
});

export default connect(mapStoreToProps)(GlobalFooter);
