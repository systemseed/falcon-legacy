import React from 'react';
import PropTypes from 'prop-types';
import ImageWithText from '../../molecules/ImageWithText';

const ImageWithTextPane = ({ styles, imageWithTextData }) => {
  return (
    <div className={"row image-with-text-pane limited-width " + styles}>
      {
        imageWithTextData.map((data, i) => {
          return (
            <div className="col-12 p-0" key={i}>
              <ImageWithText
                reverseOrder={(i % 2) == 0}
                headline={data.headline}
                copy={data.copy}
                imageUrl={data.imageUrl}
                imageTitle={data.imageTitle}
                imageAlt={data.imageAlt}
              />
            </div>
          )
        })
      }
    </div>
  );
};

ImageWithTextPane.propTypes = {
  styles: PropTypes.string,
  imageWithTextData: PropTypes.arrayOf(PropTypes.shape({
    reverseOrder: PropTypes.bool,
    headline: PropTypes.string,
    copy: PropTypes.string,
    imageUrl: PropTypes.string,
    imageTitle: PropTypes.string,
    imageAlt: PropTypes.string
  })),
};

export default ImageWithTextPane;
