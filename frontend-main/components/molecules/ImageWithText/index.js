import React from 'react';
import PropTypes from 'prop-types';
import Image from '../../atoms/Image';
import Heading3 from '../../atoms/Heading3';
import PlainText from '../../atoms/PlainText';

const ImageWithText = ({ reverseOrder, headline, copy, imageUrl, imageTitle, imageAlt }) => {
  return (
    <div className="row image-with-text no-gutters">
      <div className={"image-with-text__image col-sm-6" + (reverseOrder ? " order-sm-2" : "")}>
        <Image imageUrl={imageUrl} imageTitle={imageTitle} imageAlt={imageAlt} />
      </div>
      <div className={"image-with-text__text col-sm-6" + (reverseOrder ? " order-sm-1" : "")}>
        <div className="inside">
          <Heading3>{headline}</Heading3>
          <PlainText>{copy}</PlainText>
        </div>
      </div>
    </div>
  );
};

ImageWithText.propTypes = {
  reverseOrder: PropTypes.bool,
  headline: PropTypes.string,
  copy: PropTypes.string,
  imageUrl: PropTypes.string,
  imageTitle: PropTypes.string,
  imageAlt: PropTypes.string
};

export default ImageWithText;