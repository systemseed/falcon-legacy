import React, { Component } from 'react';
import { connect } from 'react-redux';
import Form from 'react-jsonschema-form';
import { Alert } from 'react-bootstrap';
import * as giftActions from '../../actions/gifts';
import * as productActions from '../../actions/products';
import * as adminActions from '../../actions/admin';
import Loading from '../../components/Loading';

class GiftEditContainer extends Component {
  // TODO: fetch schema from backend.
  schema = {
    title: '',
    type: 'object',
    required: ['title', 'category_id', 'field_gift_annotation'],
    properties: {
      title: {
        type: 'string', title: 'Title', maxLength: 255
      },
      category_id: {
        title: 'Category',
        type: 'string',
        enum: [],
        enumNames: []
      },
      field_gift_annotation: {
        title: '',
        type: 'object',
        properties: {
          value: {
            type: 'string', title: 'Annotation'
          }
        }
      },
      field_gift_description: {
        title: '',
        type: 'object',
        properties: {
          value: {
            type: 'string', title: 'Description'
          }
        }
      }
    }
  };

  uiSchema = {
    field_gift_annotation: {
      'value': {
        'ui:widget': 'textarea'
      }
    },
    field_gift_description: {
      'value': {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 10
        }
      }
    }
  };

  state = {
    // Schema will be updated when categories will be loaded.
    schema: this.schema
  };

  componentWillMount() {
    const { gifts, dispatch } = this.props;

    // Init loading of all products to get currentGift prop initialized.
    if (!gifts.isFulfilled && !gifts.isPending) {
      dispatch(giftActions.loadAll());
    }

    this.initForm(this.props);
  }

  componentWillReceiveProps(newProps) {
    this.initForm(newProps);
  }

  componentWillUnmount() {
    // Clean-up store.
    this.props.dispatch(adminActions.unmountGiftForm());
  }

  initForm(props) {
    const { editGift, currentGift, categories, match, dispatch } = props;

    if (!currentGift) {
      // Can't init form values before product is loaded.
      return;
    }

    if (editGift && editGift.id === match.params.productId) {
      // The form is already initialized for this product.
      return;
    }

    // Initialize list of categories.
    if (this.state.schema.properties.category_id.enum.length !== categories.length) {
      const schema = { ...this.state.schema };

      schema.properties = {
        ...schema.properties,
        category_id: {
          ...schema.properties.category_id,
          enum: categories.map(category => category.id),
          enumNames: categories.map(category => category.name)
        }
      };

      this.setState({ schema });
    }

    dispatch(adminActions.initGiftForm(currentGift));
  }

  onSubmit({ formData }) {
    const { currentGift, dispatch } = this.props;

    dispatch(productActions.update(currentGift, formData));
  }

  render() {
    const editGift = this.props.editGift;

    if (!editGift) {
      return <Loading />;
    }

    const showErrorMessage = !editGift.isPending && editGift.isError;
    const showSuccessMessage = !editGift.isPending && editGift.isFulfilled;

    return (
      <div>
        {showErrorMessage && <Alert bsStyle="danger">Error while saving the product.</Alert> }
        {showSuccessMessage && <Alert bsStyle="success">Product has been saved.</Alert> }
        <Form
          schema={this.state.schema}
          uiSchema={this.uiSchema}
          onSubmit={this.onSubmit.bind(this)}
          formData={editGift.formData}
        >
          <button type="submit" disabled={!!editGift.isPending} className="btn btn-info">Save</button>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  gifts: state.gifts,
  currentGift: state.gifts.products.filter(item => item.id === ownProps.match.params.productId)[0],
  editGift: state.admin.editGift,
  // TODO: fetch all available categories. Currently, only non-empty are used.
  categories: state.gifts.categories

});

export default connect(
  mapStateToProps
)(GiftEditContainer);

