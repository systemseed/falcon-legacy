import React from 'react';
import { Route, NavLink } from 'react-router-dom';

const MainMenu = ({ isMenuCollapsed, onMenuClick }) => (
  <nav className={`main-navigation text-center ${isMenuCollapsed ? '' : 'open'}`}>
    <ul className="menu">

      <Route
        path="/" exact children={({ match }) => (
          <li className={match ? 'current-menu-item' : ''}>
            <NavLink to="/" exact onClick={onMenuClick}>
              Browse Gifts
            </NavLink>
          </li>
      )}
      />

      <Route
        path="/corporate" children={({ match }) => (
          <li className={match ? 'current-menu-item' : ''}>
            <NavLink to="/corporate" onClick={onMenuClick}>
              Corporate Gifts
            </NavLink>
          </li>
      )}
      />

      <Route
        path="/faq" children={({ match }) => (
          <li className={match ? 'current-menu-item' : ''}>
            <NavLink to="/faq" onClick={onMenuClick}>
              FAQs
            </NavLink>
          </li>
      )}
      />

      <Route
        path="/how-gifts-work" children={({ match }) => (
          <li className={match ? 'current-menu-item' : ''}>
            <NavLink to="/how-gifts-work" onClick={onMenuClick}>
              How Gifts Work
            </NavLink>
          </li>
      )}
      />

      <Route
        path="/contact" children={({ match }) => (
          <li className={match ? 'current-menu-item' : ''}>
            <NavLink to="/contact" onClick={onMenuClick}>
              Contact
            </NavLink>
          </li>
      )}
      />

    </ul>
  </nav>
);

MainMenu.propTypes = {
  isMenuCollapsed: React.PropTypes.bool.isRequired,
  onMenuClick: React.PropTypes.func.isRequired,
};

export default MainMenu;
