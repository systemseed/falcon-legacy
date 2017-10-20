import React, { PropTypes } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import AccessDeniedView from '../../views/AccessDeniedView';
import GiftEditContainer from '../../containers/GiftEditContainer';
import GiftCardsEditContainer from '../../containers/GiftCardsEditContainer';
import { userHasRole } from '../../utils/authentication';
import AdminProductNav from '../../components/AdminProductNav';
import Loading from '../../components/Loading';

// Render product administer pages.
const ProductAdminContainer = ({ isAllowed }) => {
  if (isAllowed === true) {
    return (
      <div>
        <Route
          path="/admin/:productTypePrefix/:productId" render={({ match }) =>
            <AdminProductNav productId={match.params.productId} productTypePrefix={match.params.productTypePrefix} />
          }
        />
        <Switch>
          <Route exact path="/admin/gifts/:productId/edit" component={GiftEditContainer} />
          {/* <Route exact path="/admin/corporate/:productId/edit" component={CorporateGiftEditContainer} />*/}
          {/* <Route exact path="/admin/gifts/:productId/edit/prices" component={GiftEditContainer} />*/}
          {/* <Route exact path="/admin/corporate/:productId/prices" component={CorporateGiftEditContainer} />*/}
          <Route exact path="/admin/gifts/:productId/edit/cards" component={GiftCardsEditContainer} />
        </Switch>
      </div>
    );
  }

  if (isAllowed === false) {
    return (
      <Route component={AccessDeniedView} />
    );
  }

  // We don't know yet if user has access or not.
  return <Loading />;
};

ProductAdminContainer.propTypes = {
  isAllowed: PropTypes.bool
};

ProductAdminContainer.defaultProps = {
  isAllowed: null
};

const mapStateToProps = (state, ownProps) => ({
  isAllowed: state.isPersistentReady ? userHasRole(state, ownProps.userRole) : null,
});

export default connect(mapStateToProps)(ProductAdminContainer);
