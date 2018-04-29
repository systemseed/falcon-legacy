import React from 'react';

/**
 * Simple link without Next.js routing.
 */
const ExternalLink = ({ title, url }) => (
  <a className="external-link" href={url}>{title}</a>
)

export default ExternalLink;
