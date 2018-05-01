import React from 'react';
import PropTypes from 'prop-types';
import BackgroundImage from '../../atoms/BackgroundImage';


const HeroImagePane = ({ styles, imageUrl, imageTitle }) => {
  return (
    <div className={"row hero-image-pane " + styles}>
      <BackgroundImage imageUrl={imageUrl} imageTitle={imageTitle} />
    </div>
  );
};

HeroImagePane.propTypes = {
  imageUrl: PropTypes.string,
  imageTitle: PropTypes.string,
};

HeroImagePane.defaultProps = {
  styles: 'bg-white',
};

export default HeroImagePane;
