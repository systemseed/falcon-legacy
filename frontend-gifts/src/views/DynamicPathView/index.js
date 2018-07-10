import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { withDone as withServerDone } from 'react-router-server';
import _find from 'lodash/find';
import _isEmpty from 'lodash/isEmpty';

import NotFoundView from '../NotFoundView';
import * as pageActions from '../../actions/pages';
import * as redirectActions from '../../actions/redirects';
import Loading from '../../components/Loading';
import BasicPageContainer from '../../containers/BasicPageContainer';

// Render pages and handles redirects by dynamic page path.
class DynamicPathView extends Component {

  componentWillMount() {
    // Load list of pages and redirects is they haven't been loaded yet.
    const { pages, loadAllPages, redirects, loadAllRedirects, done } = this.props;

    const loaders = [];

    if (!redirects.list.length) {
      loaders.push(loadAllRedirects());
    }
    if (!pages.list.length) {
      loaders.push(loadAllPages());
    }

    // Start backend rendering when all loading is completed.
    // Otherwise server will return incomplete data on basic page view.
    Promise.all(loaders).then(done, done);
  }

  render = () => {
    const { match, location, pages, redirects } = this.props;

    if ((!redirects.isFulfilled && !redirects.isPending) || redirects.isPending) {
      return <Loading big />;
    }

    // Check for redirects.
    const redirect = _find(redirects.list, item =>
      item.source_path === location.pathname.replace(/\/+$/g, '')
    );
    if (redirect) {
      return <Redirect to={redirect.redirect_url} />;
    }

    if ((!pages.isFulfilled && !pages.isPending) || pages.isPending) {
      return <Loading big />;
    }

    // Try to find the page.
    const page = _find(pages.list, item =>
      item.field_fieldable_path === `/${match.params.path}`
    );
    if (_isEmpty(page)) {
      return <NotFoundView />;
    }

    return <BasicPageContainer page={page} location={this.props.location} />;
  }
}

DynamicPathView.propTypes = {
  match: React.PropTypes.object,
  location: React.PropTypes.object,
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
  redirects: React.PropTypes.shape({
    isPending: React.PropTypes.bool,
    isFulfilled: React.PropTypes.bool,
    isError: React.PropTypes.bool,
    list: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        uuid: React.PropTypes.string,
        redirect_source: React.PropTypes.object,
        status_code: React.PropTypes.number,
        redirect_url: React.PropTypes.string
      })
    )
  }),
  loadAllRedirects: React.PropTypes.func,
  done: React.PropTypes.func
};

const mapStateToProps = state => ({
  pages: state.pages,
  redirects: state.redirects
});

const mapDispatchToProps = {
  loadAllPages: pageActions.loadAll,
  loadAllRedirects: redirectActions.loadAll
};

export default withServerDone(connect(mapStateToProps, mapDispatchToProps)(DynamicPathView));
