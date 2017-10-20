import React from 'react';
import FeaturedImage from '../../containers/FeaturedImageContainer';
import BasicPageContainer from '../../containers/BasicPageContainer';

const AboutPageView = ({ uuid }) => (
  <div className="basic-page-about">
    <FeaturedImage uuid="8d8a5e66-2223-4994-b309-d7c79b9d2501" />
    <BasicPageContainer uuid={uuid} />
  </div>
);

AboutPageView.propTypes = {
  uuid: React.PropTypes.string.isRequired,
};

AboutPageView.defaultProps = {
  uuid: '4b76f020-dddf-44c6-b285-51fa0552437f',
};

export default AboutPageView;
