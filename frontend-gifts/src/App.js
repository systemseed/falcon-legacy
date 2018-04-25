import React from 'react';
import { IntlProvider } from 'react-intl';
import { AnimatedSwitch } from 'react-router-transition';
import PageRoute from './components/RouteWithTransition';
import FrontPageView from './views/FrontPageView';
import BasketView from './views/BasketView';
import ContactPageView from './views/ContactPageView';
import GiftView from './views/GiftView';
import CorporateGiftView from './views/CorporateGiftView';
import CorporateGiftsView from './views/CorporateGiftsView';
import CheckoutView from './views/CheckoutView';
import ThankYouView from './views/ThankYouView';
import BasicPageView from './views/BasicPageView';
import MessageBarContainer from './containers/MessageBarContainer';
import GlobalHeader from './components/GlobalHeader';
import ScrollToTop from './components/ScrollToTop';

// Importing pre-defined css.
import './styles/css/vendors/bootstrap.min.css';
import './styles/css/vendors/material-icons.min.css';
import './styles/css/vendors/socicon.min.css';
// Importing our custom sass-generated css.
import './styles/css/theme.css';

const App = () => (
  <IntlProvider locale="en">
    <ScrollToTop>
      <div className="page-wrapper">

        <GlobalHeader />
        <MessageBarContainer />

        <AnimatedSwitch
          atEnter={{ opacity: 0 }}
          atLeave={{ opacity: 2 }}
          atActive={{ opacity: 1 }}
          className="switch-wrapper"
          mapStyles={styles => (styles.opacity > 1 ? { display: 'none' } : { opacity: styles.opacity })}
        >
          {/* ROUTES FROM THE MAIN MENU */}
          <PageRoute exact path="/" component={FrontPageView} />
          <PageRoute exact path="/corporate" component={CorporateGiftsView} />
          <PageRoute exact path="/contact" component={ContactPageView} />
          {/* GIFTS AND CORPORATE GIFTS FULL VIEW PAGES */}
          <PageRoute exact path="/gifts/:path" component={GiftView} />
          <PageRoute exact path="/corporate/:path" component={CorporateGiftView} />
          {/* COMMERCE BASKET & CHECKOUT PAGES */}
          <PageRoute exact path="/checkout" component={CheckoutView} />
          <PageRoute path="/checkout/:orderId/complete" component={ThankYouView} />
          <PageRoute exact path="/basket" component={BasketView} />
          {/* CARD POPUP. CONTAINS FRONTPAGE ON THE BACKGROUND */}
          <PageRoute path="/gift-card/:giftCard" component={FrontPageView} />
          {/* GIFTS CATEGORIES */}
          <PageRoute exact path="/category/:categoryName" component={FrontPageView} />

          {/* Process redirects, then try to find the page and show 404 if not found */}
          <PageRoute path="/:path" component={BasicPageView} />
        </AnimatedSwitch>
      </div>
    </ScrollToTop>
  </IntlProvider>
);

export default App;
