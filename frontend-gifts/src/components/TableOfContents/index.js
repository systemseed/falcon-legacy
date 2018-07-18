import React, { PropTypes } from 'react';
import { scrollToElement } from '../../utils/scrollTo';

const TableOfContents = ({ tableOfContents }) => (
  <ul className="table-of-contents">
    {tableOfContents.map(item => (
      <li key={item.id}>
        <a
          href={`#${item.id}`} onClick={(e) => {
            // Disable default link behaviour.
            e.preventDefault();
            // Scroll to the ref using helper method which takes the sticky header
            // in considereation.
            scrollToElement(item.id);
            // Update URL for those who want to share the link.
            window.location.hash = `#${item.id}`; // eslint-disable-line no-undef
          }}
        >{item.label}</a>
      </li>
    ))
    }
  </ul>
);

TableOfContents.propTypes = {
  tableOfContents: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string
    }).isRequired
  ),
};

export default TableOfContents;
