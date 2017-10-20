import React, { PropTypes } from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';


const PopupContainer = ({ isOpened, title, body }) => (
  <Modal show={isOpened}>

    <Modal.Header>
      <Modal.Title>
        {title}
      </Modal.Title>
    </Modal.Header>

    <Modal.Body>
      {body}
    </Modal.Body>

  </Modal>
);

PopupContainer.propTypes = {
  isOpened: PropTypes.bool,
  title: PropTypes.string,
  body: PropTypes.node,
};

const mapStateToProps = state => ({
  isOpened: state.popup.isOpened,
  title: state.popup.title,
  body: state.popup.body,
});

export default connect(mapStateToProps)(PopupContainer);
