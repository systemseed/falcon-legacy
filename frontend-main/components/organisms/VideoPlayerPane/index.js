import React from 'react';
import PropTypes from 'prop-types';
import VideoPlayer from '../../atoms/VideoPlayer';

const VideoPlayerPane = ({ styles, videoUrl, posterUrl }) => {
  return (
    <div className={"row justify-content-center limited-width video-player-pane " + styles}>
      <div className="col-12 col-xl-8 p-0">
        <VideoPlayer videoUrl={videoUrl} posterUrl={posterUrl} />
      </div>
    </div>
  );
};

VideoPlayerPane.propTypes = {
  videoUrl: PropTypes.string,
  posterUrl: PropTypes.string,
};

VideoPlayerPane.defaultProps = {
  styles: 'bg-grey',
};

export default VideoPlayerPane;
