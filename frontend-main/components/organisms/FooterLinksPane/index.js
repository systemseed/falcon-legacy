import React from 'react';
import PropTypes from 'prop-types';
import FooterData from '../../molecules/FooterData';
import ExternalLink from '../../atoms/ExternalLink';

const FooterLinksPane = ({ styles, links }) => {
  if (!links || !links.length) {
    return null;
  }
  return (
    <div className={"row justify-content-center limited-width footer-links-pane " + styles}>
      <div className="col-12 col-xl-10">
        <div className="row">
          {links.map((item, i) => (
            <div className="col-md footer-links-pane__link_block" key={`${item.url}${i}`}>
              <ExternalLink key={`${item.url}${i}`} {...item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

FooterLinksPane.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    url: PropTypes.string,
  })),
};

FooterLinksPane.defaultProps = {
  styles: 'bg-grey',
};

export default FooterLinksPane;
