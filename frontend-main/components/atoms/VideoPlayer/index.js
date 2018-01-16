import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ videoUrl }) => {
  return (
    <ReactPlayer
      url={videoUrl}
      className='video-player'
      width='100%'
      height='100%'
      controls
    />
  );
};

VideoPlayer.propTypes = {
  videoUrl: PropTypes.string,
};

VideoPlayer.defaultProps = {
  videoUrl: '',
};
export default VideoPlayer;