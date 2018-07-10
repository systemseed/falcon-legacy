import React from 'react';
import { Link } from 'react-router-dom';
import ArrowIcon from '../ArrowIcon';

const BasketBackButton = () => (
  <Link to="/basket" className="btn btn-small btn-secondary">
    <ArrowIcon />
    Basket
  </Link>
);

export default BasketBackButton;
