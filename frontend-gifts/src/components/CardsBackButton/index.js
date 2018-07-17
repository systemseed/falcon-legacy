import React from 'react';
import { Link } from 'react-router-dom';
import ArrowIcon from '../ArrowIcon';

const CardsBackButton = () => (
  <Link to="/cards" className="btn btn-small btn-secondary">
    <ArrowIcon />
    Edit Cards
  </Link>
);

export default CardsBackButton;
