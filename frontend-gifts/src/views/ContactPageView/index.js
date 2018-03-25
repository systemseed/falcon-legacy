import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import FeaturedImage from '../../containers/FeaturedImageContainer';
import ContactInfo from '../../components/ContactInfo';
import ContactFormContainer from '../../containers/ContactFormContainer';
import CustomPageMetatags from '../../components/CustomPageMetatags';

const ContactPageView = () => (
  <div>
    <CustomPageMetatags id="contact" />
    <FeaturedImage uuid="3accbd3e-64b3-4af4-9ff0-95fdeea5a555" />

    <Grid className="space-top-3x" componentClass="section">
      <h1>Contact us</h1>

      <Row className="padding-top">

        <Col sm={5} className="padding-bottom-2x">
          <ContactInfo />
        </Col>

        <Col sm={7} className="padding-bottom-2x">
          <ContactFormContainer />
        </Col>

      </Row>
    </Grid>

  </div>
);

export default ContactPageView;
