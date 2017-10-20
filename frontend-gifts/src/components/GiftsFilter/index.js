import React from 'react';

const GiftsFilter = ({ categories, filter, filterClick, removeFilterClick }) => {
  const categoriesList = categories.map(category =>
    <li
      key={category.id}
      className={filter.categoryId === category.id ? 'active' : ''}
    >
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          filterClick(category.id);
        }}
      >
        {category.name}
      </a>
    </li>
  );

  return (
    <section className="container padding-top-1x">
      <div className="filters-bar space-top-half">
        <div className="column">
          <ul className="nav-filters">
            <li className={filter.isFiltered ? '' : 'active'}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  removeFilterClick();
                }}
              >
                All
              </a>
            </li>
            { categoriesList }
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
  filter: React.PropTypes.shape({
    isFiltered: React.PropTypes.bool,
    categoryId: React.PropTypes.string,
  }).isRequired,
  filterClick: React.PropTypes.func.isRequired,
  removeFilterClick: React.PropTypes.func.isRequired,
};

export default GiftsFilter;
