import React, { Component, PropTypes } from 'react';
import superagentJsonapify from 'superagent-jsonapify';
import request from 'superagent';
import { Log } from '../../lib';
import Form from '../../components/Form';
import config from '../../config';

// TODO: move non-redux components to ../../components or connect to redux.
// NOTE: this component is not in use at the moment.
/**
 * Generic component for working with forms when using Drupal Entities.
 * todo: Needs more work to work with auth and more complex types of data.
 *   For example referenced entities.
 */
class DrupalFormContainer extends Component {
  state = {
    schema: ''
  };

  // Submit to backend
  // todo: enahcne so we pass in auth
  onSubmit = (submission) => {
    request
      .post(`${config.backend}/v1/gifts/jsonapi/${this.props.entity}/${this.props.bundle}`)
      .send({
        'data': {
          'type': `${this.props.entity}--${this.props.bundle}`,
          'attributes': submission.formData
        }
      })
      .set('Content-Type', 'application/vnd.api+json')
      .end((err, res) => {
        if (err || !res.ok) {
          Log.error(err);
          this.props.submitError(err, res);
        }
        else {
          this.props.submitSuccess(res);
        }
      });
  };

  componentDidMount = () => {
    // Let superagent-jsonapify parse JSON API response for us.
    superagentJsonapify(request);

    // Get schema
    request
      .get(`${config.backend}/v1/${this.props.backend}/data-model/${this.props.entity}/${this.props.bundle}`)
      .end((err, res) => {
        if (err) {
          Log.error(err);
        }
        else if (res.statusCode === 200 && res.body) {
          if (this.props.debug) {
            console.log(res.body);
          }
          this.setState({
            schema: res.body.properties
          });
        }
      });
  };

  render = () => {
    if (!this.state.schema) {
      return <div><h2>Loading</h2></div>;
    }
    return (
      <div>
        <Form
          schema={this.state.schema.attributes}
          fieldsFilter={this.props.fieldsFilter}
          uiSchema={this.props.uiSchema}
          onSubmit={this.onSubmit}
        />
      </div>
    );
  };
}

DrupalFormContainer.defaultProps = {
  'uiSchema': {},
  'debug': false
};

DrupalFormContainer.propTypes = {
  'entity': PropTypes.string.isRequired,
  'bundle': PropTypes.string.isRequired,
  'backend': PropTypes.string.isRequired,
  'fieldsFilter': PropTypes.array.isRequired,
  'submitSuccess': PropTypes.func.isRequired,
  'submitError': PropTypes.func.isRequired,
  'uiSchema': PropTypes.object,
  'debug': PropTypes.bool,
};

export default DrupalFormContainer;
