import React, { PropTypes } from 'react';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { connect } from 'react-redux';


class PriceFilter extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;

    const currencySymbols = { EUR: '€', GPB: '￡' };
    const currentCurrencySymbol = currencySymbols[this.props.currentCurrency];

    // This is a workaround to group prices for better UX.
    // Marks config control dots on the price range slider.
    // Keys on the left are dot positions evenly spaced from each other and also slider range values.
    // Values on the right are actual price values.
    const marks = {
      0: 0,
      1: 50,
      2: 100,
      3: 500,
      4: 1000,
      5: 1500
    };

    // Calculating initial Slider range value from price range.
    const initialSliderRangeValue = [0, 5];
    Object.keys(marks).forEach((key) => {
      if (marks[key] === this.props.initialPriceRange[0]) {
        initialSliderRangeValue[0] = parseInt(key, 10);
      }

      if (marks[key] === this.props.initialPriceRange[1]) {
        initialSliderRangeValue[1] = parseInt(key, 10);
      }
    });

    this.state = {
      lowerBound: 0,
      upperBound: 5,
      value: initialSliderRangeValue, // Slider range scale.
      priceRange: [0, 1500], // Actual price range.
      marks,
      currentCurrencySymbol
    };
  }


  onSliderChange = (value) => {
    const currentLowerBound = this.state.marks[value[0]];
    const currentUpperBound = this.state.marks[value[1]];
    const priceRange = [currentLowerBound, currentUpperBound];
    this.props.onPriceChange(priceRange);
    this.setState({
      value,
      priceRange
    });
  };


  render() {
    const defaultLowerValue = this.state.marks[this.state.value[0]];
    const defaultUpperValue = this.state.marks[this.state.value[1]];

    return (
      <div className="price-filter">
        <div className="clearfix price-filter__header">
          <span className="price-filter__title pull-left">Price range</span>
          <span className="price-filter__values pull-right">
            {this.state.currentCurrencySymbol}{defaultLowerValue} - {this.state.currentCurrencySymbol}{defaultUpperValue}
          </span>
        </div>
        <Range
          marks={this.state.marks}
          allowCross={false}
          step={1}
          defaultValue={[this.state.value[0], this.state.value[1]]}
          min={this.state.lowerBound} max={this.state.upperBound}
          onChange={this.onSliderChange}
        />
      </div>
    );
  }
}

PriceFilter.propTypes = {
  onPriceChange: PropTypes.func.isRequired,
  currentCurrency: PropTypes.string.isRequired,
  initialPriceRange: PropTypes.array.isRequired
};

const mapStateToProps = store => ({
  initialPriceRange: store.gifts.priceRange
});

export default connect(mapStateToProps)(PriceFilter);

