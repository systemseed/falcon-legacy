import React from 'react';
import PropTypes from 'prop-types';
import VideoPlayer from '../../atoms/VideoPlayer';

const VideoPlayerPane = ({ styles, videoUrl }) => {
  return (
    <div className={"row justify-content-center video-player-pane " + styles}>
      <div className="col-12 col-xl-8 p-0">
        <VideoPlayer videoUrl={videoUrl} />
      </div>
    </div>
  );
};

VideoPlayerPane.propTypes = {
  videoUrl: PropTypes.string,
};

export default VideoPlayerPane;
