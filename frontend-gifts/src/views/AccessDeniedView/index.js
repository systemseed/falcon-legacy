import React from 'react';
import { Link } from 'react-router-dom';
import CustomPageMetatags from '../../components/CustomPageMetatags';

const AccessDeniedView = () => (
  <div>
    <CustomPageMetatags id="403" />
    <h1>403 Access Denied</h1>
    <p>You don’t have access to this page. Please <Link to="/login">login</Link> to proceed.</p>
  </div>
);

export default AccessDeniedView;
