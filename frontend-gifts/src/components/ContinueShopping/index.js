import React from 'react';
import { Link } from 'react-router-dom';
import ArrowIcon from '../ArrowIcon';

const ContinueShopping = () => (
  <Link to="/" className="btn btn-small btn-secondary">
    <ArrowIcon />
    Continue shopping
  </Link>
);

export default ContinueShopping;
