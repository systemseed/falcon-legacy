import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { withDone as withServerDone } from 'react-router-server';
import * as menuActions from '../../actions/menu';

class MainMenu extends Component {

  componentWillMount() {
    // Load list of pages is they haven't been loaded yet.
    const { menu, loadMenu, done } = this.props;
    if (!menu.list.length) {
      loadMenu().then(done, done);
    }
  }

  render = () => {
    const { isMenuCollapsed, onMenuClick, location, menu } = this.props;

    return (<nav className={`main-navigation text-center ${isMenuCollapsed ? '' : 'open'}`}>
      <ul className="menu">
        {menu.list.map((item) => {
          if (!item.url) {
            return '';
          }
          return (<li key={item.uuid}>
            <NavLink to={item.url} exact onClick={onMenuClick} location={location}>{item.title}</NavLink>
          </li>);
        })}
      </ul>
    </nav>);
  }

}

MainMenu.propTypes = {
  isMenuCollapsed: React.PropTypes.bool.isRequired,
  onMenuClick: React.PropTypes.func.isRequired,
  location: React.PropTypes.object.isRequired,
  loadMenu: React.PropTypes.func,
  done: React.PropTypes.func,
  menu: React.PropTypes.shape({
    isPending: React.PropTypes.bool,
    isFulfilled: React.PropTypes.bool,
    isError: React.PropTypes.bool,
    list: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        uuid: React.PropTypes.string,
        title: React.PropTypes.string,
        url: React.PropTypes.string
      })
    )
  })
};

const mapStateToProps = state => ({
  // Pass location prop to NavLink explicitly.
  // See https://github.com/ReactTraining/react-router/issues/4638
  location: state.router.location,
  menu: state.menu
});

const mapDispatchToProps = {
  loadMenu: menuActions.loadAll,
};

export default withServerDone(connect(mapStateToProps, mapDispatchToProps)(MainMenu));
