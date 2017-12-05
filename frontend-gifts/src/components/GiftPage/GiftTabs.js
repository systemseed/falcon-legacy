import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

// Disable default react-tabs styles.
Tabs.setUseDefaultStyles(false);

const GiftTabs = ({ gift }) => (
  <section className="container padding-top-2x">

    <Tabs>

      <TabList className="text-center">
        <Tab>What you get</Tab>
        <Tab>Gift in action</Tab>
      </TabList>

      <TabPanel>
        <div className="row space-top">
          <div className="col-md-6 space-bottom">
            <img src="/images/postal-card.jpg" width="555" alt="" />
          </div>
          <div className="col-md-6">
            <div dangerouslySetInnerHTML={{ __html: gift.description }} />
          </div>
        </div>
      </TabPanel>

      <TabPanel>
        <div className="row space-top">
          <div className="col-md-6 space-bottom">
            { gift.actionImageUrl &&
            <img src={gift.actionImageUrl} alt={`${gift.title} in action`} />
            }
          </div>
          <div className="col-md-6">
            { gift.actionDescription &&
              <div dangerouslySetInnerHTML={{ __html: gift.actionDescription }} />
            }
          </div>
        </div>
      </TabPanel>

    </Tabs>
  </section>
);

GiftTabs.propTypes = {
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

export default GiftTabs;
