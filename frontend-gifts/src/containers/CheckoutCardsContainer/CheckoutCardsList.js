import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import ProductCardItem from './ProductCardItem';
import EmailCardForm from './EmailCardForm';
import ModalPreviewGiftCard from '../../components/ModalPreviewGiftCard';
import { checkoutCardTypeChanged, checkoutCardEmailFormChanged } from '../../actions/checkout';

class CheckoutCardsList extends Component {
  state = {
    openedCardIndex: -1,
    openedPreview: -1
  }

  onChangeType(index, type) {
    const { dispatch } = this.props;

    if (type === 'email') {
      this.setState({ openedCardIndex: index });
    }
    else if (this.state.openedCardIndex === index) {
      this.setState({ openedCardIndex: -1 });
    }

    dispatch(checkoutCardTypeChanged(index, type));
  }

  onChangeEmailForm(index, emailFormData, validated = false) {
    const { dispatch } = this.props;
    if (validated === true) {
      this.setState({ openedCardIndex: -1 });
    }

    dispatch(checkoutCardEmailFormChanged(index, emailFormData, validated));
  }


  onPreviewOpen(cardIndex) {
    this.setState({ openedPreview: cardIndex });
  }

  onPreviewClose() {
    this.setState({ 'openedPreview': -1 });
  }

  render() {
    const { cards } = this.props;
    return (
      <Row>
        {
          cards.map(card => (
            <Col xs={12} key={card.cardIndex}>
              <ProductCardItem cardItem={card} onChangeType={this.onChangeType.bind(this)} onPreviewOpen={this.onPreviewOpen.bind(this)} />
              <EmailCardForm card={card} expanded={this.state.openedCardIndex === card.cardIndex} onChangeEmailForm={this.onChangeEmailForm.bind(this)} onPreviewOpen={this.onPreviewOpen.bind(this)} />
              <ModalPreviewGiftCard show={this.state.openedPreview === card.cardIndex} card={card} onHide={this.onPreviewClose.bind(this)} />
            </Col>
          ))
        }
      </Row>
    );
  }
}

export default CheckoutCardsList;
