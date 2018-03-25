import React from 'react';
import { Button } from 'react-bootstrap';

/**
 * Custom Button element based on Bootstrap button.
 *
 * Inherited from Bootstrap button, but with blocked double clicking.
 */
class CwButton extends Button {

  constructor(props) {
    super(props);
    this.state = {
      'clicked': false
    };
  }

  onClick = () => {
    // Prevents double clicking.
    if (this.state.clicked) {
      return;
    }

    this.setState({ clicked: true });
    setTimeout(() => this.setState({ clicked: false }), 300);


    // Invokes original onClick function if exists.
    if (this.props.onClick !== undefined) {
      this.props.onClick();
    }
  };

  render = () => (
    <Button
      {...this.props}
      // Overrides onClick function.
      onClick={() => this.onClick()}
    >
      {this.props.children}
    </Button>
  );
}

export default CwButton;
