import React, { Component } from 'react';
import superagentJsonapify from 'superagent-jsonapify';
import request from 'superagent';
import Form from '../../components/Form';
import config from '../../config';

// This is example component to demonstrate schema forms for entity type. To be removed.
// TODO: move non-redux components to ../../components or connect to redux.
class CreateBasicPageContainer extends Component {
  state = {
    schema: '',
    submitted: false,
    error: false
  };

  // This both filters and sets the order of the fields.
  // To use a dot notation you will have to look at the schema model returned.
  // Don't worry about
  fieldsFilter = [
    'title',
    'body.value'
  ];

  uiSchema = {
    'body': {
      'value': {
        'ui:widget': 'textarea'
      }
    }
  };

  onSubmit = (submission) => {
    // TODO: oauth tokens are now stored in redux store.
    const oauth = JSON.parse(localStorage.getItem('oauth'));
    const access_token = oauth != null ? oauth.gifts.access_token : '';
    // @todo: Disable 'Bypass profile access control' for anonymous when perms issue fixed.
    request
      .post(`${config.backend}/v1/gifts/jsonapi/node/cw_page`)
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        'data': {
          'type': 'node--page',
          'attributes': submission.formData
        }
      })
      .set('Content-Type', 'application/vnd.api+json')
      .end((err, res) => {
        if (err || !res.ok) {
          this.setState({ submitted: true, error: true });
          console.log(`Fail: ${err}`);
        }
        else {
          this.setState({ submitted: true });
        }
      });
  };

  componentDidMount = () => {
    // Let superagent-jsonapify parse JSON API response for us.
    superagentJsonapify(request);

    // Get schema of gifts profile.
    request
      .get(`${config.backend}/v1/gifts/data-model/node/cw_page`)
      .end((err, res) => {
        if (err) {
          console.log(`Fail: ${err}`);
        }
        else if (res.statusCode === 200 && res.body) {
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
    if (this.state.submitted === true) {
      if (this.state.error === true) {
        return <div><strong>There was an error processing the submission</strong></div>;
      }
      return <div><h2>Submitted</h2></div>;
    }

    return (
      <div>
        <Form
          schema={this.state.schema.attributes}
          fieldsFilter={this.fieldsFilter}
          uiSchema={this.uiSchema}
          onSubmit={this.onSubmit}
        />
      </div>
    );
  };
}

export default CreateBasicPageContainer;
