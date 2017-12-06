import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import api from '../../lib/api';

const HowGiftsWork = ({ labels, images, alts }) => {
  // Do not render if configuration is incomplete / broken.
  if (labels.length !== images.length) {
    return null;
  }

  return (
    <Row className="space-top">
      {labels.map((label, index) => (
        <Col md={4} className="space-bottom" key={index}>
          <h3>{label}</h3>
          <img src={api.getImageUrl('gifts', images[index])} alt={alts[index]} title={alts[index]} />
        </Col>
      ))}
    </Row>
  );
};


HowGiftsWork.propTypes = {
  labels: React.PropTypes.array,
  images: React.PropTypes.array,
  alts: React.PropTypes.array,
};

const mapStoreToProps = store => ({
  labels: store.siteContentSettings.data.fieldConfigCorporateLabels,
  images: store.siteContentSettings.data.fieldConfigCorporateImages,
  alts: store.siteContentSettings.data.relationships.field_config_corporate_images.data.map(item => item.meta.alt)
});

export default connect(mapStoreToProps)(HowGiftsWork);
