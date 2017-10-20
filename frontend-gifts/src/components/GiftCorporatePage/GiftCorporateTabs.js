import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Grid, Row, Col } from 'react-bootstrap';

// Disable default react-tabs styles.
Tabs.setUseDefaultStyles(false);

const GiftCorporateTabs = ({ gift }) => (
  <Grid componentClass="section" className="container padding-top-2x">

    <Tabs>

      <TabList className="text-center">
        <Tab>Description</Tab>
        <Tab>How Gifts Work</Tab>
      </TabList>

      <TabPanel>
        <Row className="space-top">
          <Col md={6} className="space-bottom">
            <img src="//placehold.it/600x300" alt="600x300" />
          </Col>
          <Col md={6} className="space-bottom">
            <div dangerouslySetInnerHTML={{ __html: gift.description }} />
          </Col>
        </Row>
      </TabPanel>

      <TabPanel>
        <Row className="space-top">
          <Col md={4} className="space-bottom">
            <h3>1. Choose / Order</h3>
            <img src="//placehold.it/300x300" alt="300x300" />
          </Col>
          <Col md={4} className="space-bottom">
            <h3>2. What you get</h3>
            <img src="//placehold.it/300x300" alt="300x300" />
          </Col>
          <Col md={4} className="space-bottom">
            <h3>3. Hope</h3>
            <img src="//placehold.it/300x300" alt="300x300" />
          </Col>
        </Row>
      </TabPanel>

    </Tabs>
  </Grid>
);

GiftCorporateTabs.propTypes = {
  gift: React.PropTypes.shape({
    id: React.PropTypes.string,
    type: React.PropTypes.string,
    title: React.PropTypes.string,
    categoryId: React.PropTypes.string,
    variantType: React.PropTypes.string,
    annotation: React.PropTypes.string,
    description: React.PropTypes.string,
    price: React.PropTypes.object,
    imageUrl: React.PropTypes.string,
    actionImageUrl: React.PropTypes.string,
    actionDescription: React.PropTypes.string,
  }).isRequired,
};

export default GiftCorporateTabs;
