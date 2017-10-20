import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Modal } from 'react-bootstrap';
import api from '../../lib/api';
import EmailGiftCard from '../../components/EmailGiftCard';
import Loading from '../../components/Loading';

class ModalGiftCard extends Component {
  state = {
    'is_fetching': false,
    'is_ready': false,
    'error_message': '',
    'is_closed': false
  }

  componentDidMount() {
    this.fetchCard();
  }

  fetchCard() {
    const { cardId } = this.props;
    // Already fetching.
    if (this.state.is_fetching) {
      return;
    }

    this.setState({ is_fetching: true });

    api.getEcardItem(cardId)
      .then((cardItemResponse) => {
        const cardItemData = cardItemResponse.body.data;
        if (cardItemData && cardItemData.donationsProductUuid) {
          this.setState({ card: cardItemData });
        }
        else {
          throw new Error('Cannot load card item by uuid.');
        }

        const productId = cardItemData.donationsProductUuid;
        const promiseCardConfig = api.getProductCardConfigs(productId, 'email');
        const promiseProduct = api.getProduct('gift', productId);

        return Promise.all([promiseCardConfig, promiseProduct]);
      })
      .then((dataArray) => {
        let product;
        let cardConfig;
        dataArray.forEach((data) => {
          if (data.statusCode && data.body.data.id) {
            product = data.body.data;
          }
          else {
            cardConfig = data.card;
          }
        });

        product.imageUrl = api.getImageUrl('donations', product.fieldGiftImage);
        if (cardConfig.fieldImage) {
          cardConfig.imageUrl = api.getImageUrl('gifts', cardConfig.fieldImage.fieldImage);
        }

        this.setState({ is_fetching: false, is_ready: true, product, cardConfig });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ error_message: 'Can’t load this Gift card.', is_fetching: false });
      });
  }

  onClose() {
    this.setState({ is_closed: true });
  }

  render() {
    if (this.state.is_closed) {
      return (
        <Redirect push to="/" />
      );
    }

    return (
      <Modal show backdrop="static" onHide={this.onClose.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>Gift Card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { this.state.error_message &&
            <p>{this.state.error_message}</p>
          }
          { this.state.is_ready === true &&
          <EmailGiftCard product={this.state.product} card={this.state.card} cardConfig={this.state.cardConfig} />
          }
          { this.state.is_ready === false && !this.state.error_message &&
          <Loading />
          }
        </Modal.Body>
      </Modal>
    );
  }
}

export default ModalGiftCard;
