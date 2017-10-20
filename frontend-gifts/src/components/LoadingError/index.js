import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

const LoadingError = ({ type }) => (
  <Grid className="space-top space-bottom">
    <Row>
      <Col xs={12}>
        Could not load {type}. Please, refresh the page or contact the site administrator.
      </Col>
    </Row>
  </Grid>
);

LoadingError.propTypes = {
  type: React.PropTypes.string.isRequired,
};

export default LoadingError;
