import React from 'react';
import PropTypes from 'prop-types';

class HeroBackgroundImage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      heroHeight: undefined,
    };
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  updateDimensions() {


    if (this.heroImage !== undefined) {
      let calcHeight = this.heroImage.clientHeight;
      if (this.heroImage.clientHeight < this.heroImage.parentNode.clientHeight) {
        calcHeight = this.heroImage.parentNode.clientHeight;
      }
//1.5
//2.5
      let dim = this.heroImage.clientWidth / calcHeight;
      console.log(dim);
      if (dim > 2.5) {
        calcHeight = this.heroImage.clientWidth / 2.5;
      }
      else if (dim < 1.5) {
        calcHeight = this.heroImage.clientWidth / 1.5;
      }
      this.setState({ heroHeight: calcHeight });
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    this.updateDimensions();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  render() {
    const { imageUrl, ...attributes } = this.props;

    console.log(this.state.heroHeight);

    if (!imageUrl) {
      return null;
    }
    const baseUrl = process.env.BASE_URL || window.BASE_URL || '';
    const compStyle = {
      backgroundImage: 'url(' + baseUrl + imageUrl + ')',
      height: this.state.heroHeight !== undefined ? this.state.heroHeight + 'px' : '100%'
    };
    return(
      <div className="hero-background-image" style={compStyle} ref={(el) => { this.heroImage = el; }} {...attributes} />
    );
  }
}

HeroBackgroundImage.propTypes = {
  imageUrl: PropTypes.string
};

export default HeroBackgroundImage;