import React, { PropTypes } from 'react';
import { NavLink } from 'react-router-dom';

const AdminProductNav = ({ productTypePrefix, productId }) => (
  <ul className="nav nav-tabs">
    <li><NavLink to={`/${productTypePrefix}/${productId}`}>View</NavLink></li>
    <li><NavLink to={`/admin/${productTypePrefix}/${productId}/edit`}>Edit</NavLink></li>
    <li className="disabled"><NavLink to={`/admin/${productTypePrefix}/${productId}/edit/prices`}>Prices</NavLink></li>
    { productTypePrefix === 'gifts' &&
      <li><NavLink to={`/admin/${productTypePrefix}/${productId}/edit/cards`}>Cards</NavLink></li>
    }
  </ul>
  );

AdminProductNav.propTypes = {
  productId: PropTypes.string.isRequired,
  productTypePrefix: PropTypes.oneOf(['gifts', 'corporate']).isRequired
};

export default AdminProductNav;
