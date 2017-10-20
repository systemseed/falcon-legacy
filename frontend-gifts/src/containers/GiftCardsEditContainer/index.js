import React, { Component } from 'react';
import { connect } from 'react-redux';
import Form from 'react-jsonschema-form';
import { Alert } from 'react-bootstrap';
import { getAccessToken } from '../../utils/authentication';
import api from '../../lib/api';

// TODO: refactor with redux-promise-middleware. See GiftEditContainer for example.
class GiftCardsEditContainer extends Component {
  // TODO: fetch schema from backend.
  schema = {
    title: '',
    type: 'object',
    required: ['physical', 'email'],
    properties: {
      physical: {
        title: 'Postal card',
        type: 'object',
        required: [],
        properties: {
          media_id: {
            type: 'string',
            title: 'Image UUID',
            maxLength: 255,
            description: 'Enter image UUID from admin/content/media tab (Gifts backend). This is a temporary solution until Media Hub is launched.'
          }
        }
      },
      email: {
        title: 'E-card',
        type: 'object',
        required: [],
        properties: {
          field_intro_text: {
            title: '',
            type: 'object',
            properties: {
              value: {
                type: 'string', title: 'Intro text'
              }
            }
          },
          field_card_message: {
            title: '',
            type: 'object',
            properties: {
              value: {
                type: 'string', title: 'Main message'
              }
            }
          },
          media_id: {
            type: 'string',
            title: 'Image UUID',
            maxLength: 255,
            description: 'Enter image UUID from admin/content/media tab (Gifts backend). This is a temporary solution until Media Hub is launched.'
          }
        }
      }
    }
  };

  uiSchema = {
    email: {
      field_intro_text: {
        'value': {
          'ui:widget': 'textarea'
        }
      },
      field_card_message: {
        'value': {
          'ui:widget': 'textarea',
          'ui:options': {
            rows: 10
          }
        }
      }
    }
  };

  state = {
    schema: this.schema,
    uiSchema: this.uiSchema,
    formData: null,
    is_ready: false,
    is_fetching_cards: false,
    is_submitting: false,
    cards: null,
    error: false,
    message: ''
  };

  // See https://facebook.github.io/react/blog/2015/12/16/ismounted-antipattern.html
  isUnmounted = false;

  componentIsReady(props) {
    // Component is ready. Nothing to do.
    if (this.state.is_ready) {
      return;
    }

    const productId = props.match.params.productId;

    // Cards are not fetched yet.
    if (this.state.is_fetching_cards) {
      return;
    }

    // Cards are not fetched yet. Init request.
    this.setState({ is_fetching_cards: true });

    api.getProductCardConfigs(productId).then(
      (items) => {
        const newFormData = {};
        const newCards = {
          physical: false,
          email: false
        };
        items.forEach((item) => {
          // Process physical card.
          if (item.type === 'physical' && item.card) {
            newFormData.physical = { media_id: item.card.fieldImage.id };
            newCards.physical = item.card;
          }
          // Process email card.
          if (item.type === 'email' && item.card) {
            newFormData.email = {
              media_id: item.card.fieldImage.id,
              field_intro_text: { value: item.card.fieldIntroText ? item.card.fieldIntroText.value : '' },
              field_card_message: { value: item.card.fieldCardMessage ? item.card.fieldCardMessage.value : '' }
            };

            newCards.email = item.card;
          }
        });

        // The form is now ready for rendering. Update state.
        if (!this.isUnmounted) {
          this.setState({ formData: newFormData, cards: newCards, is_fetching_cards: false, is_ready: true });
        }
      }
    ).catch(() => {
      if (!this.isUnmounted) {
        this.setState({
          is_fetching_cards: false,
          error: true,
          message: 'Cannot load card configuration for the product.',
          is_ready: true
        });
      }
    });
  }

  componentWillReceiveProps(newProps) {
    this.componentIsReady(newProps);
  }

  componentDidMount() {
    this.componentIsReady(this.props);
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  onSubmit({ formData }) {
    const { accessToken } = this.props;
    const { cards } = this.state;
    const productId = this.props.match.params.productId;

    this.setState({ formData, is_submitting: true });

    let relationships = {};
    if (formData.physical.media_id) {
      relationships.field_image = {
        data: { type: 'media--gift_cards', id: formData.physical.media_id }
      };
    }
    const PromisePhysical = api.saveGiftsCardConfig(
      accessToken,
      { type: 'physical', id: (cards.physical ? cards.physical.id : null) },
      { donations_product_uuid: productId },
      relationships
    );

    relationships = {};
    if (formData.email.media_id) {
      relationships.field_image = {
        data: { type: 'media--gift_cards', id: formData.email.media_id }
      };
    }
    const PromiseEmail = api.saveGiftsCardConfig(
      accessToken,
      { type: 'email', id: (cards.email ? cards.email.id : null) },
      {
        donations_product_uuid: productId,
        field_intro_text: formData.email.field_intro_text,
        field_card_message: formData.email.field_card_message
      },
      relationships
    );

    Promise.all([PromisePhysical, PromiseEmail]).then(() => {
      this.setState({
        message: 'The configuration has been saved.',
        error: false,
        is_submitting: false
      });
    })
    .catch(() => {
      this.setState({
        message: 'Error while saving cards configuration. Try to logout and login to get fresh auth token.',
        error: true,
        is_submitting: false
      });
    });
  }

  render() {
    if (!this.state.is_ready) {
      return (
        <h2>Loading...</h2>
      );
    }
    return (
      <div>
        {this.state.message && <Alert bsStyle={this.state.error ? 'danger' : 'success'}>{this.state.message}</Alert> }
        <Form
          schema={this.state.schema}
          uiSchema={this.uiSchema}
          onSubmit={this.onSubmit.bind(this)}
          formData={this.state.formData}
        >
          <button type="submit" disabled={!!this.state.is_submitting} className="btn btn-primary">Save</button>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  accessToken: getAccessToken(state, 'gifts')
});

export default connect(
  mapStateToProps
)(GiftCardsEditContainer);

