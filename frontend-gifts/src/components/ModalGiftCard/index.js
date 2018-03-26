import React, { Component, PropTypes } from 'react';
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
    const { cardId, done } = this.props;
    this.fetchCard(cardId, done);
  }

  async fetchCard(cardId, done) {
    // Already fetching.
    if (this.state.is_fetching) {
      return;
    }

    this.setState({ is_fetching: true });

    // Simple async...await approach without server side rendering.
    try {
      const card = await api.getEcardItem(cardId);
      const product = await api.getProduct('gift', card.donationsProductUuid);

      this.setState({
        is_fetching: false,
        is_ready: true,
        card,
        product
      });
    }
    catch (error) {
      this.setState({
        is_fetching: false,
        error_message: 'Error occured while loading your Gift card.'
      });
    }
    finally {
      done();
    }
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
          {this.state.error_message &&
            <p>{this.state.error_message}</p>
          }
          {this.state.is_ready === true &&
            <EmailGiftCard product={this.state.product} card={this.state.card} />
          }
          {this.state.is_ready === false && !this.state.error_message &&
            <Loading />
          }
        </Modal.Body>
      </Modal>
    );
  }
}

ModalGiftCard.propTypes = {
  cardId: PropTypes.string.isRequired,
  done: PropTypes.func
};

export default ModalGiftCard;
