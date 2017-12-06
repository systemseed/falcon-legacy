import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Nav, NavItem, Image } from 'react-bootstrap';
import EmailGiftCard from '../EmailGiftCard';

class ModalPreviewGiftCard extends Component {

  state = {
    type: ''
  }

  onTypeChange(type) {
    this.setState({ type });
  }

  render() {
    const { show, card, onHide, senderFirstName } = this.props;
    const type = this.state.type || card.type;
    const fakeCardItem = {
      fieldFriendsName: card.emailFormData.field_friends_name,
      fieldMessage: card.emailFormData.field_message,
      fieldSenderFirstName: senderFirstName
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
            <EmailGiftCard product={card.product} card={fakeCardItem} cardConfig={card.cardConfigs.email} />
          }
          {type === 'physical' &&
            <div>
              <h2>Postal Card</h2>
              <p>If you choose this postal card option, we’ll post you a printed gift card for you to personalise and send to your friend or loved one.</p>
              {/* Use product's What you get image instead of Gift Card configuration. */}
              {card.product.whatYouGetImageUrl &&
                <Image src={card.product.whatYouGetImageUrl} alt={card.product.whatYouGetImageAlt} responsive />
              }
              {/* card.cardConfigs.physical && card.cardConfigs.physical.imageUrl &&
              <Image src={card.cardConfigs.physical.imageUrl} alt={card.product.title} responsive />
            */}
            </div>
          }
        </Modal.Body>
      </Modal>
    );
  }

}
// Get senderName value from a separate form.
const mapStateToProps = state => ({
  senderFirstName: state.checkout.form.profile.formData.field_profile_first_name
});

export default connect(mapStateToProps)(ModalPreviewGiftCard);
