import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import FeaturedImage from '../../containers/FeaturedImageContainer';

const FrontPageCopy = ({ siteContentSettings }) => (
  <div className="front-page-copy">
    <Grid className="padding-top-2x">
      <Row>
        <Col sm={12} md={6}>
          {siteContentSettings.fieldConfigFrontPageSubline &&
            <h1 dangerouslySetInnerHTML={{ __html: siteContentSettings.fieldConfigFrontPageSubline.value }} />
          }
          {siteContentSettings.fieldConfigFrontPageCopy &&
            <p dangerouslySetInnerHTML={{ __html: siteContentSettings.fieldConfigFrontPageCopy.value }} />
          }
        </Col>
        <Col sm={12} md={6}>
          <FeaturedImage uuid="722f5be9-151e-405f-9890-df742dd3376b" />
        </Col>
      </Row>
    </Grid>
  </div>
);

FrontPageCopy.propTypes = {
  siteContentSettings: React.PropTypes.object,
};

const mapStoreToProps = store => ({
  siteContentSettings: store.siteContentSettings.data,
});

export default connect(mapStoreToProps)(FrontPageCopy);
