import React from 'react';
import { Link } from 'react-router-dom';

class GiftsFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: props.isCollapsed
    };
  }

  toggleCollapse() {
    this.setState(state => ({ isCollapsed: !state.isCollapsed }));
  }

  render() {
    return (
      <section className="padding-top-1x">
        <div className="filters-bar space-top-half">
          <div className="column">
            <button
              onClick={this.toggleCollapse.bind(this)}
              className={`category-filter-btn ${!this.state.isCollapsed ? 'collapsed' : ''}`}
            >
              {this.props.categoryName ? this.props.categoryName : 'All gifts'}
              <span className="material-icons chevron_right category-filter-icon" />
            </button>

            <ul className={`nav-filters ${!this.state.isCollapsed ? 'collapsed' : ''}`}>
              <button onClick={this.toggleCollapse.bind(this)} className="clear-btn">
                <span className="material-icons clear" />
              </button>
              <li className={!this.props.categoryId ? 'active' : ''}>
                <Link to="/">
                  All gifts
                </Link>
              </li>
              {this.props.categories.map(category =>
                <li
                  key={category.id}
                  className={category.id === this.props.categoryId ? 'active' : ''}
                >
                  <Link onClick={this.toggleCollapse.bind(this)} to={category.path}>
                    {category.name}
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <div className="column" />
        </div>
      </section>
    );
  }
}

GiftsFilter.propTypes = {
  categories: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
    })
  ).isRequired,
  categoryId: React.PropTypes.string,
  categoryName: React.PropTypes.string,
  isCollapsed: React.PropTypes.bool.isRequired,
};

export default GiftsFilter;
