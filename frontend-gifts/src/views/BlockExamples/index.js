import React, { Component } from 'react';
import request from 'superagent';
import superagentJsonapify from 'superagent-jsonapify';
import BlockContainer from '../../containers/BlockContainer';
import config from '../../config';

// TODO: remove unused components.
class BlockExamples extends Component {
  state = {
    uuids: []
  };

  componentDidMount = () => {
    superagentJsonapify(request);
    request
      // Template literals are....slow compared.
      .get(`${config.backend}/v1/gifts/jsonapi/block_content/content_block`)
      .end((err, res) => {
        if (err) {
          // todo: Error handler
        }
        else if (res.statusCode === 200 && res.body) {
          if (res.body.data) {
            res.body.data.forEach(
              (item) => {
                this.setState({
                  uuids: [...this.state.uuids, item.uuid]
                });
              });
          }
        }
      });
  };

  render = () => (
    <div>{
      this.state.uuids.map(uuid => (
        <div key={uuid}><BlockContainer uuid={uuid} /></div>
        ))
      }
    </div>
  );
}

export default BlockExamples;
