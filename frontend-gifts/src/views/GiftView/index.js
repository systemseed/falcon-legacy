import React, { PropTypes } from 'react';
import GiftContainer from '../../containers/GiftContainer';
/* import AdminAccess from '../../containers/AdminAccess';
import AdminProductNav from '../../components/AdminProductNav'; */

const GiftView = ({ match }) => (
  <div>
    {/*
    <AdminAccess>
      <AdminProductNav productId={match.params.id} productTypePrefix="gifts" />
    </AdminAccess>
    */}

    <GiftContainer productUrl={match.url} />
  </div>
);

GiftView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }),
    url: PropTypes.string.isRequired
  }).isRequired,
};

export default GiftView;
