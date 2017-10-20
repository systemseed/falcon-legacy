import React, { Component, PropTypes } from 'react';
import request from 'superagent';
import superagentJsonapify from 'superagent-jsonapify';
import Block from '../../components/Block';
import config from '../../config';

// TODO: move non-redux components to ../../components or connect to redux.
class BlockContainer extends Component {
  state = {
    content: ''
  };

  componentDidMount = () => {
    superagentJsonapify(request);
    request
      .get(`${config.backend}/v1/gifts/jsonapi/block_content/content_block/${this.props.uuid}`)
      .end((err, res) => {
        if (err) {
          // todo: Error handler
        }
        else if (res.statusCode === 200 && res.body) {
          this.setState({ content: res.body.data.body.value });
        }
      });
  };

  render = () => <Block content={this.state.content} />
}

BlockContainer.propTypes = {
  uuid: PropTypes.string.isRequired
};

export default BlockContainer;
