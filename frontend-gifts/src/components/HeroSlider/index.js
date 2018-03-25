import React from 'react';
import Carousel from 'nuka-carousel';
import HeroSliderItem from './HeroSliderItem';

const HeroSlider = ({ slides }) => {
  const items = slides.map(slide =>
    <HeroSliderItem {...slide} />
  );

  return (
    <section className="hero-slider">
      <div className="inner">
        {/* https://github.com/FormidableLabs/nuka-carousel */}
        <Carousel
          slidesToShow={1}
          autoplay
          wrapAround
        >
          {items}
        </Carousel>
      </div>
    </section>
  );
};

HeroSlider.propTypes = {
  slides: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      title: React.PropTypes.string.isRequired,
      linkTitle: React.PropTypes.string.isRequired,
      linkUrl: React.PropTypes.string.isRequired,
      imageUrl: React.PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default HeroSlider;
