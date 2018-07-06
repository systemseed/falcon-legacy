import React, { PropTypes } from 'react';
import classNames from 'classnames';

const BlockInfoCard = ({ title, image, description }) => (
  <div className={classNames('col-xs-12', 'col-md-6', 'block', 'block-info-card')}>
    <div className="category-tile">
      <div className="inner">
        <div className="column">
          <h3 className="space-bottom-half">{title}</h3>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>
        <div className="column">
          <div className="category-thumb">
            <img src={image.src} alt={image.alt} />
          </div>
        </div>

      </div>
    </div>
  </div>
);

BlockInfoCard.propTypes = {
  'title': PropTypes.string.isRequired,
  'image': PropTypes.object.isRequired,
  'description': PropTypes.string,
};

export default BlockInfoCard;
