import React from 'react';
import { connect } from 'react-redux';

class ContactInfo extends React.Component {

  render = () => {
    const { siteContentSettings } = this.props;

    return (
      <div>
        {siteContentSettings.fieldConfigContactUsAddress &&
          <div dangerouslySetInnerHTML={{ __html: siteContentSettings.fieldConfigContactUsAddress.value }} />
        }
      </div>
    );
  }
}

ContactInfo.propTypes = {
  siteContentSettings: React.PropTypes.object,
};

const mapStoreToProps = (store) => ({
    siteContentSettings: store.siteContentSettings.data,
  });

export default connect(mapStoreToProps)(ContactInfo);
