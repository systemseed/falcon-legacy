import React, { Component } from 'react';
import Form from 'react-jsonschema-form';
import { Button, Col, Row } from 'react-bootstrap';

class ProductCardItem extends Component {
  typeSchema = {
    title: '',
    type: 'string',
    enum: ['physical', 'email'],
    enumNames: ['Postal', 'Email']
  };

  typeUiSchema = {
    'ui:widget': 'radio',
    'ui:options': {
      'inline': true
    }
  }

  state = {
    type: 'physical'
  }

  onChangeType({ formData }) {
    this.setState({ type: formData });
    this.props.onChangeType(this.props.cardItem.cardIndex, formData);
  }

  onPreviewClick() {
    this.props.onPreviewOpen(this.props.cardItem.cardIndex);
  }

  render() {
    const { cardItem } = this.props;
    return (
      <Row className="card-product">
        <Col md={4} sm={3} xs={12}>
          <span>{cardItem.product.title}</span>
        </Col>
        <Col md={5} sm={7} xs={7}>
          <Form
            schema={this.typeSchema}
            uiSchema={this.typeUiSchema}
            formData={this.state.type}
            onChange={this.onChangeType.bind(this)}
          ><button type="submit" style={{ display: 'none' }} /></Form>
        </Col>
        <Col md={3} sm={2} xs={5}>
          <Button
            bsStyle="primary"
            className="btn-block btn-sm"
            onClick={this.onPreviewClick.bind(this)}
          >
            Preview
          </Button>
        </Col>
      </Row>
    );
  }
}

export default ProductCardItem;
