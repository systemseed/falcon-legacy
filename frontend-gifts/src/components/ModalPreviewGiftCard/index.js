import React, { Component, PropTypes } from 'react';
import { Modal, Nav, NavItem } from 'react-bootstrap';
import EmailGiftCard from '../EmailGiftCard';
import PostalGiftCard from '../PostalGiftCard';

class ModalPreviewGiftCard extends Component {

  state = {
    type: ''
  }

  onTypeChange(type) {
    this.setState({ type });
  }

  render() {
    const { show, card, onHide } = this.props;
    const type = this.state.type || card.type;
    const fakeCardItem = {
      fieldFriendsName: card.emailFormData.field_friends_name,
      fieldMessage: card.emailFormData.field_message
    };

    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Nav bsStyle="tabs" activeKey={type} onSelect={this.onTypeChange.bind(this)}>
            <NavItem eventKey="physical" title="Postal">Postal</NavItem>
            <NavItem eventKey="email" title="Email">Email</NavItem>
          </Nav>
        </Modal.Header>
        <Modal.Body>
          {type === 'email' &&
            <EmailGiftCard product={card.product} card={fakeCardItem} />
          }
          {type === 'physical' &&
            <PostalGiftCard product={card.product} />
          }
        </Modal.Body>
      </Modal>
    );
  }

}

ModalPreviewGiftCard.propTypes = {
  show: PropTypes.bool.isRequired,
  card: PropTypes.object.isRequired,
  onHide: PropTypes.func.isRequired
};

export default ModalPreviewGiftCard;
