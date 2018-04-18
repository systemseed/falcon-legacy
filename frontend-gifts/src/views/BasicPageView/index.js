import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withDone as withServerDone } from 'react-router-server';
import _find from 'lodash/find';
import _isEmpty from 'lodash/isEmpty';

import NotFoundView from '../NotFoundView';
import * as pageActions from '../../actions/pages';
import Loading from '../../components/Loading';
import BasicPageContainer from '../../containers/BasicPageContainer';

class BasicPageView extends Component {

  componentWillMount() {
    // Load list of pages is they haven't been loaded yet.
    const { pages, loadAllPages, done } = this.props;
    if (!pages.list.length) {
      loadAllPages().then(done, done);
    }
  }

  render = () => {
    const { match, pages } = this.props;

    if ((!pages.isFulfilled && !pages.isPending) || pages.isPending) {
      return <Loading big />;
    }

    const page = _find(pages.list, item => item.field_fieldable_path === `/${match.params.path}`);
    if (_isEmpty(page)) {
      return <NotFoundView />;
    }

    return <BasicPageContainer page={page} />;
  }
}

BasicPageView.propTypes = {
  match: React.PropTypes.object,
  pages: React.PropTypes.shape({
    isPending: React.PropTypes.bool,
    isFulfilled: React.PropTypes.bool,
    isError: React.PropTypes.bool,
    list: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        uuid: React.PropTypes.string,
        title: React.PropTypes.string,
        body: React.PropTypes.shape({
          value: React.PropTypes.string,
          summary: React.PropTypes.string,
          format: React.PropTypes.string,
        }),
        field_fieldable_path: React.PropTypes.string,
        field_metatags: React.PropTypes.object
      })
    )
  }),
  loadAllPages: React.PropTypes.func,
  done: React.PropTypes.func
};

const mapStateToProps = state => ({
  pages: state.pages
});

const mapDispatchToProps = {
  loadAllPages: pageActions.loadAll,
};

export default withServerDone(connect(mapStateToProps, mapDispatchToProps)(BasicPageView));
