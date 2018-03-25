import React from 'react';
import { connect } from 'react-redux';
import { withDone as withServerDone } from 'react-router-server';
import _isEmpty from 'lodash/isEmpty';
import * as pageUtils from '../../utils/page';
import * as pageActions from '../../actions/page';
import BasicPage from '../../components/BasicPage';
import Metatags from '../../components/Metatags';
import Loading from '../../components/Loading';
import LoadingError from '../../components/LoadingError';

class BasicPageContainer extends React.Component {

  componentWillMount() {
    if (_isEmpty(this.props.page)) {
      this.props.dispatch(pageActions.load(this.props.uuid)).then(this.props.done, this.props.done);
    }
  }

  render = () => {
    const { page, isPending, isFulfilled } = this.props;

    if (isPending) {
      return <Loading big />;
    }

    if (isFulfilled && !_isEmpty(page)) {
      return (
        <div>
          <Metatags metatags={page.field_metatags} />
          <BasicPage page={page} />
        </div>);
    }

    return <LoadingError type="the page content" />;
  }

}

BasicPageContainer.propTypes = {
  dispatch: React.PropTypes.func,
  uuid: React.PropTypes.string.isRequired,
  page: React.PropTypes.shape({
    uuid: React.PropTypes.string,
    title: React.PropTypes.string,
    body: React.PropTypes.shape({
      value: React.PropTypes.string,
      summary: React.PropTypes.string,
      format: React.PropTypes.string,
    }),
  }),
  isPending: React.PropTypes.bool,
  isFulfilled: React.PropTypes.bool,
  done: React.PropTypes.func
};

const mapStateToProps = (state, ownProps) => ({
  page: pageUtils.getPage(state.basicPage.list, ownProps.uuid),
  isPending: state.basicPage.isPending,
  isFulfilled: state.basicPage.isFulfilled,
});

export default withServerDone(connect(mapStateToProps)(BasicPageContainer));
