import React from 'react';
import { Link } from 'react-router-dom';

const HeroSliderItem = ({ imageUrl, title, linkTitle, linkUrl }) => (
  <div className="slide" style={{ backgroundImage: `url(${imageUrl})` }}>
    <div className="container text-center padding-top-3x">
      <span className="h1 from-bottom">{title}</span>
      <Link
        to={linkUrl}
        className="btn btn-primary btn-with-icon-right waves-effect waves-light scale-up"
      >
        {linkTitle}
        <i className="material-icons arrow_forward" />
      </Link>
    </div>
  </div>
);

HeroSliderItem.propTypes = {
  title: React.PropTypes.string.isRequired,
  linkTitle: React.PropTypes.string.isRequired,
  linkUrl: React.PropTypes.string.isRequired,
  imageUrl: React.PropTypes.string.isRequired,
};

export default HeroSliderItem;
