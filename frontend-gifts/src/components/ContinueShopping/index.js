import React from 'react';
import { Link } from 'react-router-dom';

const ContinueShopping = () => (
  <div className="continue-shopping">
    <Link to="/" className="btn">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12">
        <g fill="none" fillRule="evenodd">
          <path d="M-3-3h18v18H-3z" />
          <path className="fill" fillRule="nonzero" d="M12 5.25H2.872l4.193-4.192L6 0 0 6l6 6 1.057-1.057L2.872 6.75H12z" />
        </g>
      </svg>
      Continue shopping
    </Link>
  </div>
);

export default ContinueShopping;
