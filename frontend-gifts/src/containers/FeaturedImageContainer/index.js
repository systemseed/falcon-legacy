import React from 'react';
import { connect } from 'react-redux';
import { withDone as withServerDone } from 'react-router-server';
import * as featuredImageActions from '../../actions/featuredImage';
import * as featuredImageUtils from '../../utils/featuredImages';

// This component supports data fetching on server side.
// It means that server will wait for this.props.done() function call before calling render() method.
// As a result, component will be rendered with background image already in place.
// See https://github.com/gabrielbull/react-router-server for more info.
class FeaturedImageContainer extends React.Component {

  componentWillMount() {
    // done is a callback provided by 'react-router-server' to let
    // server know that component is now ready for rendering.
    const { dispatch, done } = this.props;
    if (!this.props.imageUrl) {
      // redux-promise-middleware returns a promise after dispatching an action.
      // It allows us to simply attach done function to that promise.
      dispatch(featuredImageActions.fetchAll()).then(done, done);
    }
  }

  render = () => (
    <div
      className="featured-image"
      style={{ backgroundImage: `url(${this.props.imageUrl})` }}
      title={this.props.imageAlt}
    />
  );
}

FeaturedImageContainer.propTypes = {
  dispatch: React.PropTypes.func,
  imageUrl: React.PropTypes.string,
  imageAlt: React.PropTypes.string,
  uuid: React.PropTypes.string.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const featuredImage = featuredImageUtils.get(state.featuredImages.list, ownProps.uuid);
  return {
    imageUrl: featuredImage ? featuredImage.url : '',
    imageAlt: featuredImage ? featuredImage.alt : '',
  };
};

// Wrap component into withServerDone.
// It makes sense for components that fetch some data on initial rendering.
export default withServerDone(connect(mapStateToProps)(FeaturedImageContainer));
