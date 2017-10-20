import React, { PropTypes } from 'react';

const style = {
  border: '1px solid #222',
  margin: '0.4rem 0',
  padding: '0.4rem'
};

const Block = ({ content }) => (
  <div style={style} dangerouslySetInnerHTML={{ __html: content }} />
);

Block.propTypes = {
  content: PropTypes.string.isRequired,
};

export default Block;
