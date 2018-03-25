import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';

const FrontPageCopy = ({ siteContentSettings }) => (
  <div>
    <Grid className="padding-top-3x">
      <Row>
        <Col md={12}>
          {siteContentSettings.fieldConfigFrontPageSubline &&
            <h1 dangerouslySetInnerHTML={{ __html: siteContentSettings.fieldConfigFrontPageSubline.value }} />
          }
          {siteContentSettings.fieldConfigFrontPageCopy &&
            <h2 dangerouslySetInnerHTML={{ __html: siteContentSettings.fieldConfigFrontPageCopy.value }} />
          }
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
