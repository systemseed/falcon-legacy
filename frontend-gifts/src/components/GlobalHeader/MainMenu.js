import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

const MainMenu = ({ isMenuCollapsed, onMenuClick, location }) => (
  <nav className={`main-navigation text-center ${isMenuCollapsed ? '' : 'open'}`}>
    <ul className="menu">
      <li><NavLink to="/" exact onClick={onMenuClick} location={location}>Browse Gifts</NavLink></li>
      <li><NavLink to="/corporate" exact onClick={onMenuClick} location={location}>Corporate Gifts</NavLink></li>
      <li><NavLink to="/how-gifts-work" exact onClick={onMenuClick} location={location}>How Gifts Work</NavLink></li>
      <li><NavLink to="/faq" exact onClick={onMenuClick} location={location}>FAQs</NavLink></li>
      <li><NavLink to="/contact" exact onClick={onMenuClick} location={location}>Contact</NavLink></li>
    </ul>
  </nav>
);

MainMenu.propTypes = {
  isMenuCollapsed: React.PropTypes.bool.isRequired,
  onMenuClick: React.PropTypes.func.isRequired,
  location: React.PropTypes.object.isRequired,
};

// Pass location prop to NavLink explicitly.
// See https://github.com/ReactTraining/react-router/issues/4638
const mapStateToProps = state => ({
  location: state.router.location
});

export default connect(mapStateToProps)(MainMenu);
