import React from 'react';
import { Link } from 'react-router-dom';

class GiftsFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: props.isCollapsed
    };

    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  toggleCollapse(e){
    e.preventDefault();
    this.setState({isCollapsed: !this.state.isCollapsed});
  }

  categoriesList(){
    return this.props.categories.map(category =>
    <li
      key={category.id}
      className={category.id === this.props.categoryId ? 'active' : ''}
    >
      <Link to={category.path}>
        {category.name}
      </Link>
    </li>
    );
  }

  render = () => (
    <section className="container padding-top-1x">
      <div className="filters-bar space-top-half">
        <div className="column">
          <a href="/"
            onClick={this.toggleCollapse}
            className={'category-filter-btn ' + (this.state.isCollapsed ? 'collapsed' : '')}>
            {this.props.categoryName ? this.props.categoryName: 'All gifts'}
            <span className="material-icons chevron_right category-filter-icon"></span>
          </a>

          <ul className={'nav-filters ' + (this.state.isCollapsed ? 'collapsed' : '')}>
              <button onClick={this.toggleCollapse} className="clear-btn">
                <span className="material-icons clear"></span>
              </button>
            <li className={!this.props.categoryId ? 'active' : ''}>
              <Link to="/">
                All gifts
              </Link>
            </li>
            {this.categoriesList()}
          </ul>
        </div>
        <div className="column" />
      </div>
    </section>
  );
}

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
