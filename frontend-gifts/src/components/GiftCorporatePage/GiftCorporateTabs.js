import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Grid, Row, Col } from 'react-bootstrap';
import HowGiftsWork from '../HowGiftsWork';

// Disable default react-tabs styles.
Tabs.setUseDefaultStyles(false);

const GiftCorporateTabs = ({ gift }) => (
  <Grid componentClass="section" className="container">
    <div className="bg-white padding-top-2x padding-horizontal-150-xl">
      <Tabs>
        <TabList className="text-center">
          <Tab>Description</Tab>
          <Tab>How Gifts Work</Tab>
        </TabList>

        <TabPanel>
          <Row className="space-top">
            <Col md={6} className="space-bottom wide-image">
              <img src={gift.descriptionImageUrl} alt={gift.descriptionImageAlt} title={gift.descriptionImageAlt} />
            </Col>
            <Col md={6} className="space-bottom">
              <div dangerouslySetInnerHTML={{ __html: gift.description }} />
            </Col>
          </Row>
        </TabPanel>

        <TabPanel>
          <HowGiftsWork />
        </TabPanel>
      </Tabs>
    </div>
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
    descriptionImageUrl: React.PropTypes.string,
    descriptionImageAlt: React.PropTypes.string,
    actionDescription: React.PropTypes.string,
  }).isRequired,
};

export default GiftCorporateTabs;
