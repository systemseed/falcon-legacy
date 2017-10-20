import React from 'react';
import FeaturedImage from '../../containers/FeaturedImageContainer';
import BasicPageContainer from '../../containers/BasicPageContainer';

const FaqPageView = ({ uuid }) => (
  <div className="basic-page-faq">
    <FeaturedImage uuid="4ec3bf30-0eb3-4e6c-8418-c313cf04ac38" />
    <BasicPageContainer uuid={uuid} />
  </div>
);

FaqPageView.propTypes = {
  uuid: React.PropTypes.string.isRequired,
};

FaqPageView.defaultProps = {
  uuid: '2c285fd5-68af-46dd-b3c6-a0824f11d1cd',
};

export default FaqPageView;
