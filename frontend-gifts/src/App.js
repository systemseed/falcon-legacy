import React from 'react';
import { IntlProvider } from 'react-intl';
import { Route } from 'react-router-dom';
import { AnimatedSwitch } from 'react-router-transition';
import PageRoute from './components/RouteWithTransition';
import FrontPageView from './views/FrontPageView';
import AboutPageView from './views/AboutPageView';
import FaqPageView from './views/FaqPageView';
import BasketView from './views/BasketView';
import ContactPageView from './views/ContactPageView';
import GiftView from './views/GiftView';
import NotFoundView from './views/NotFoundView';
import CorporateGiftView from './views/CorporateGiftView';
import CorporateGiftsView from './views/CorporateGiftsView';
import CheckoutView from './views/CheckoutView';
import ThankYouView from './views/ThankYouView';
import MessageBarContainer from './containers/MessageBarContainer';
import GlobalHeader from './components/GlobalHeader';
import ScrollToTop from './components/ScrollToTop';
import GiftsLegacyRedirect from './containers/GiftsLegacyRedirect';

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
          <PageRoute exact path="/faq" component={FaqPageView} />
          <PageRoute exact path="/how-gifts-work" component={AboutPageView} />
          <PageRoute path="/contact" component={ContactPageView} />
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
          <PageRoute path="/category/:categoryName" component={FrontPageView} />

          {/* Redirect from legacy Gift URLs */}
          <Route path="/charity-gift/:code/:name" component={GiftsLegacyRedirect} />

          {/* 404 PAGE IF NON OF THE ABOVE ROUTE MATCHES */}
          <PageRoute component={NotFoundView} />
        </AnimatedSwitch>
      </div>
    </ScrollToTop>
  </IntlProvider>
);

export default App;
