import React, { PropTypes } from 'react';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { connect } from 'react-redux';
import { getSymbolByCurrency } from '../../utils/currencies';


class PriceFilter extends React.Component {
  /**
   * This is a workaround to group prices for better UX.
   * Marks config control dots on the price range slider.
   * Keys on the left are dot positions evenly spaced from each other and also slider range values.
   * Values on the right are actual price values.
   * This needs to be addresed in: https://www.pivotaltracker.com/story/show/158291213
   */
  marks = {
    0: 0,
    1: 20,
    2: 40,
    3: 60,
    4: 80,
    5: 100,
    6: 150,
    7: 500,
    8: 1000,
    9: 1500
  };

  onSliderChange = (value) => {
    const priceRange = [this.marks[value[0]], this.marks[value[1]]];
    this.props.dispatch({
      type: 'FILTER_PRICE_RANGE_CHANGED',
      priceRange,
    });
  };

  getInitialSliderRangeValue() {
    // Calculating initial Slider range value from price range.
    const initialSliderRangeValue = [];
    Object.keys(this.marks)
      .forEach((key) => {
        if (this.marks[key] === this.props.priceRange[0]) {
          initialSliderRangeValue[0] = parseInt(key, 10);
        }

        if (this.marks[key] === this.props.priceRange[1]) {
          initialSliderRangeValue[1] = parseInt(key, 10);
        }
      });

    return initialSliderRangeValue;
  }

  render() {
    const currentCurrencySymbol = getSymbolByCurrency(this.props.currentCurrency);
    const initialSliderRangeValue = this.getInitialSliderRangeValue();

    return (
      <div className="price-filter">
        <div className="clearfix price-filter__header">
          <span className="price-filter__title pull-left">Price range</span>
          <span className="price-filter__values pull-right">
            {currentCurrencySymbol}{this.props.priceRange[0]} - {currentCurrencySymbol}{this.props.priceRange[1]}
          </span>
        </div>
        <Range
          marks={this.marks}
          allowCross={false}
          step={1}
          defaultValue={[initialSliderRangeValue[0], initialSliderRangeValue[1]]}
          min={0} max={9}
          onChange={this.onSliderChange}
          pushable
        />
      </div>
    );
  }
}

PriceFilter.propTypes = {
  currentCurrency: PropTypes.string.isRequired,
  priceRange: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  priceRange: store.gifts.priceRange,
});

export default connect(mapStateToProps)(PriceFilter);

