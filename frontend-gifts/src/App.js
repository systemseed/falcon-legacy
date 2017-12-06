import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import RouteWithTransition from './components/RouteWithTransition';
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
import LoginContainer from './containers/LoginContainer';
import MessageBarContainer from './containers/MessageBarContainer';
import ProductAdminContainer from './containers/ProductAdminContainer';
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

        <Switch>
          {/* ROUTES FROM THE MAIN MENU */}
          <RouteWithTransition exact path="/" component={FrontPageView} />
          <RouteWithTransition exact path="/corporate" component={CorporateGiftsView} />
          <RouteWithTransition exact path="/faq" component={FaqPageView} />
          <RouteWithTransition exact path="/how-gifts-work" component={AboutPageView} />
          <RouteWithTransition path="/contact" component={ContactPageView} />
          {/* GIFTS AND CORPORATE GIFTS FULL VIEW PAGES */}
          <RouteWithTransition exact path="/gifts/:path" component={GiftView} />
          <RouteWithTransition exact path="/corporate/:path" component={CorporateGiftView} />
          {/* COMMERCE BASKET & CHECKOUT PAGES */}
          <RouteWithTransition exact path="/checkout" component={CheckoutView} />
          <RouteWithTransition path="/checkout/:orderId/complete" component={ThankYouView} />
          <RouteWithTransition exact path="/basket" component={BasketView} />
          {/* ADMIN ZONE
          <RouteWithTransition exact path="/login" component={LoginContainer} />
          <RouteWithTransition path="/admin" component={ProductAdminContainer} />
          * ADMIN ZONE */}
          {/* CARD POPUP. CONTAINS FRONTPAGE ON THE BACKGROUND */}
          <RouteWithTransition path="/gift-card/:giftCard" component={FrontPageView} />

          {/* Redirect from legacy Gift URLs */}
          <Route path="/charity-gift/:code/:name" component={GiftsLegacyRedirect} />

          {/* 404 PAGE IF NON OF THE ABOVE ROUTE MATCHES */}
          <RouteWithTransition component={NotFoundView} />
        </Switch>
      </div>
    </ScrollToTop>
  </IntlProvider>
);

export default App;
