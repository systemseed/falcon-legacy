import React, { PropTypes } from 'react';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';


class PriceFilter extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;

    // Marks config control dots on the price range slider.
    // Keys on the left are dot positions evenly spaced from each other.
    // Values on the right are actual price values.
    const marks = {
      0: 0,
      1: 20,
      2: 40,
      3: 60,
      4: 80,
      5: 100,
      6: 120,
      7: 550,
      8: 1200
    };

    this.state = {
      lowerBound: 0,
      upperBound: 8,
      value: [0, 8],
      marks
    };
  }


  onSliderChange = (value) => {
    const currentLowerBound = this.state.marks[value[0]];
    const currentUpperBound = this.state.marks[value[1]];
    const priceRange = [currentLowerBound, currentUpperBound];
    this.props.onPriceChange(priceRange);
    this.setState({
      value,
    });
  };


  render() {
    return (
      <Range
        marks={this.state.marks}
        allowCross={false}
        step={1}
        defaultValue={[this.state.lowerBound, this.state.upperBound]}
        min={this.state.lowerBound} max={this.state.upperBound}
        onChange={this.onSliderChange}
      />
    );
  }
}

PriceFilter.propTypes = {
  onPriceChange: PropTypes.func.isRequired
};

export default PriceFilter;
