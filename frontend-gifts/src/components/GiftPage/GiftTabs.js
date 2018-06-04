import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import BundleProductsViewContainer from '../../containers/BundleProductsViewContainer';

// Disable default react-tabs styles.
Tabs.setUseDefaultStyles(false);

class GiftTabs extends React.Component {

  constructor() {
    super();
    // Use React tabs in controlled mode.
    // https://github.com/reactjs/react-tabs#controlled-mode
    this.state = { tabIndex: 0 };
  }

  componentWillReceiveProps(nextProps) {
    // Force set the first tab if it's a view of another gift.
    if (this.props.gift.id !== nextProps.gift.id) {
      this.setState({ tabIndex: 0 });
    }
  }

  render() {
    const gift = this.props.gift;

    return (
      <section className="padding-top-2x">
        <Tabs forceRenderTabPanel selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>

          <TabList className="text-center">
            <Tab>Gift in action</Tab>
            <Tab>What you get</Tab>
            {gift.variantType === 'bundle' &&
              <Tab>In this bundle</Tab>
            }
          </TabList>

          <TabPanel>
            <div className="row space-top">
              <div className="col-md-6 space-bottom wide-image">
                {gift.actionImageUrl &&
                  <img src={gift.actionImageUrl} alt={gift.actionImageAlt} title={gift.actionImageAlt} />
                }
              </div>
              <div className="col-md-6">
                {gift.actionDescription &&
                  <div dangerouslySetInnerHTML={{ __html: gift.actionDescription }} />
                }
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="row space-top">
              <div className="col-md-6 space-bottom">
                {gift.whatYouGetImage &&
                  <img src={gift.whatYouGetImage.src} alt={gift.whatYouGetImage.alt} title={gift.whatYouGetImage.alt} />
                }
              </div>
              <div className="col-md-6">
                <div dangerouslySetInnerHTML={{ __html: gift.description }} />
              </div>
            </div>
          </TabPanel>

          {gift.variantType === 'bundle' &&
            <TabPanel>
              <BundleProductsViewContainer bundle={gift} />
            </TabPanel>
          }

        </Tabs>
      </section>
    );
  }
}

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
    actionImageAlt: React.PropTypes.string,
    actionDescription: React.PropTypes.string,
    whatYouGetImage: React.PropTypes.object,
  }).isRequired,
};

export default GiftTabs;
