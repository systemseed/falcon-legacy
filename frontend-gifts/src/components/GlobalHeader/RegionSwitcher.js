import React from 'react';
import config from '../../config';

class RegionSwitcher extends React.Component {

  regions = {
    'ie': {
      'name': 'Republic of Ireland',
      'flag': '/images/flags/IE.png',
      'url': 'https://falcon.systemseed.com',
    },
    'gb': {
      'name': 'United Kingdom',
      'flag': 'images/flags/GB.png',
      'url': 'https://falcon-uk.systemseed.com',
    },
  };

  constructor() {
    super();

    this.state = {
      isCollapsed: true,
    };
  }

  toggleDropDown = () => {
    this.setState({ isCollapsed: !this.state.isCollapsed });
  }

  render() {
    const mainRegion = this.regions[config.region];

    const dropdownRegions = Object.keys(this.regions)
      // Remove main region from dropdown.
      .filter(code => code !== config.region)
      .map(code => (
        <li key={code}>
          <a href={this.regions[code].url}>
            <img src={this.regions[code].flag} alt={this.regions[code].name} />
            {code.toUpperCase()}
          </a>
        </li>
      ));

    return (
      <div
        className={`lang-switcher${this.state.isCollapsed ? '' : ' open'}`}
        onClick={this.toggleDropDown}
      >
        <div className="lang-toggle">
          <img src={mainRegion.flag} alt={mainRegion.name} />
          <i className="material-icons arrow_drop_down" />
          <ul className="lang-dropdown">
            {dropdownRegions}
          </ul>
        </div>
      </div>
    );
  }
}

export default RegionSwitcher;
