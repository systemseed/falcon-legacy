import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import api from '../../lib/api';

const ImageBlock = ({ label, image }) => (
  <Col md={4} className="space-bottom">
    <h3>{label}</h3>
    <img src={image.src} alt={image.alt} title={image.alt} />
  </Col>
);

const HowGiftsWork = ({ labels, images, alts }) => {
  // Do not render if configuration is incomplete / broken.
  if (labels.length !== images.length) {
    return null;
  }

  return (
    <Row className="space-top">
      {labels.map((label, index) => (
        <ImageBlock
          label={label}
          image={{
            src: api.getImageUrl('gifts', images[index]),
            alt: alts[index]
          }}
        />
      ))}
    </Row>
  );
};

ImageBlock.propTypes = {
  label: React.PropTypes.string,
  image: React.PropTypes.object
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
