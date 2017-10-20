import React from 'react';
/* import AdminAccess from '../../containers/AdminAccess';
import AdminProductNav from '../../components/AdminProductNav'; */
import GiftCorporateContainer from '../../containers/GiftCorporateContainer';

const CorporateGiftView = ({ match }) => (
  <div>
    {/*
    <AdminAccess>
      <AdminProductNav productId={match.params.id} productTypePrefix="corporate" />
    </AdminAccess>
    */}

    <GiftCorporateContainer productUrl={match.url} />
  </div>
);

CorporateGiftView.propTypes = {
  match: React.PropTypes.shape({
    params: React.PropTypes.shape({
      path: React.PropTypes.string.isRequired,
    }),
    url: React.PropTypes.string.isRequired,
  }).isRequired,
};

export default CorporateGiftView;
