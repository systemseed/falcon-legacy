import React from 'react';
import PropTypes from 'prop-types';

const VideoPlayer = ({ videoUrl }) => {
  return (
    <div className="video-player">
      <img src="/static/images/content/through-to-2/video.png" title={videoUrl} alt={videoUrl} />
    </div>
  );
};

VideoPlayer.propTypes = {
  videoUrl: PropTypes.string,
};

VideoPlayer.defaultProps = {
  videoUrl: '',
};
export default VideoPlayer;