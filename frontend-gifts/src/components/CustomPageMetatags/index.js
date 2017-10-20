import React from 'react';
import { connect } from 'react-redux';
import { withDone as withServerDone } from 'react-router-server';

import Metatags from '../../components/Metatags';
import * as metatagActions from '../../actions/metatag';
import * as metatagUtils from '../../utils/metatags';
import _isEmpty from 'lodash/isEmpty';

class CustomPageMetatags extends React.Component {

  componentWillMount() {
    // Load list of gifts is they haven't been
    // loaded yet.
    const { customPageMetatags, getCustomPageMetatags, done } = this.props;

    if (_isEmpty(customPageMetatags)) {
      getCustomPageMetatags().then(done, done);
    }
  }

  render = () => {
    const { customPageMetatags, id } = this.props;

    if (_isEmpty(customPageMetatags)) {
      return null;
    }
    let pageMetatags = metatagUtils.getCustomPageMetatagsById(customPageMetatags, id);

    return (
      <Metatags metatags={pageMetatags.tags} />
    );
  }
}

// Declare our props dependencies.
CustomPageMetatags.propTypes = {
  id: React.PropTypes.string,
  customPageMetatags: React.PropTypes.array,
  getCustomPageMetatags: React.PropTypes.func,
  pageMetatags: React.PropTypes.object,
};

// Anything in the returned object below is merged in with the props of the
// component, so we have access to store values but the component itself
// does not have to be aware of the store.
const mapStoreToProps = (store) => {
  return {
    customPageMetatags: store.customPageMetatags.metatags,
  };
};

const mapDispatchToProps = {
  getCustomPageMetatags: metatagActions.getCustomPageMetatags,
};

// This is where we make our component subscribe to store update.
// The final react component is actually a connect component that wraps our own
// component. .
// When we add a product to the store react rerenders CustomPageMetatags
// and all it's children.
export default withServerDone(connect(mapStoreToProps, mapDispatchToProps)(CustomPageMetatags));
