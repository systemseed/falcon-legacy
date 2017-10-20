import React from 'react';
import loader from '../../styles/img/preloader.gif';

const Loading = ({ big }) => (
  <div className={`loader${big ? ' big' : ''}`}>
    <img src={loader} alt="Loader" />
  </div>
);

Loading.defaultProps = {
  big: false,
};

Loading.propTypes = {
  big: React.PropTypes.bool,
};

export default Loading;
