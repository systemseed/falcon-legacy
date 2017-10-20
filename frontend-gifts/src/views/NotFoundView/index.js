import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import CustomPageMetatags from '../../components/CustomPageMetatags';
import FeaturedImage from '../../containers/FeaturedImageContainer';

const NotFoundView = () => (
  <div>
    <CustomPageMetatags id="404" />
    <FeaturedImage uuid="f2968940-ccd4-419f-a673-7e75cbd5bacc" />
    <Grid className="padding-top-3x">
      <Row>
        <Col xs={12}>
          <h1>404 Not Found</h1>
          <p>We are sorry, but the page you are looking for could not be found.</p>
        </Col>
      </Row>
    </Grid>
  </div>
);

export default NotFoundView;
