import React from 'react';
import { Link } from 'react-router-dom';

const GiftsFilter = ({ categories, categoryId }) => {
  const categoriesList = categories.map(category =>
    <li
      key={category.id}
      className={category.id === categoryId ? 'active' : ''}
    >
      <Link to={category.path}>
        {category.name}
      </Link>
    </li>
  );

  return (
    <section className="container padding-top-1x">
      <div className="filters-bar space-top-half">
        <div className="column">
          <ul className="nav-filters">
            <li className={!categoryId ? 'active' : ''}>
              <Link to="/">
                All
              </Link>
            </li>
            {categoriesList}
          </ul>
        </div>
        <div className="column" />
      </div>
    </section>
  );
};

GiftsFilter.propTypes = {
  categories: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
    })
  ).isRequired,
  categoryId: React.PropTypes.string,
};

export default GiftsFilter;
