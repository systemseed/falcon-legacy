import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import FeaturedImage from '../../containers/FeaturedImageContainer';

const FrontPageCopy = ({ siteContentSettings }) => (
  <div className="front-page-copy">
    <Grid fluid className="no-gutters space-bottom-2x">
      <Row>
        <Col sm={12} md={6}>
          <div className="text-pane padding-top-2x padding-bottom">
            {siteContentSettings.fieldConfigFrontPageCopy &&
              <div dangerouslySetInnerHTML={{ __html: siteContentSettings.fieldConfigFrontPageCopy.value }} />
            }
          </div>
        </Col>
        <Col sm={12} md={6} className="no-gutters">
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
