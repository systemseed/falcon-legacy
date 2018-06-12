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

    <Grid className="" componentClass="section">
      <div className="bg-white padding-top-3x padding-horizontal-150-xl padding-bottom-2x">
        <h1>Contact us</h1>

        <Row className="padding-top">

          <Col sm={5} className="padding-bottom-2x">
            <ContactInfo />
          </Col>

          <Col sm={7} className="padding-bottom-2x">
            <ContactFormContainer />
          </Col>

        </Row>
      </div>
    </Grid>

  </div>
);

export default ContactPageView;
