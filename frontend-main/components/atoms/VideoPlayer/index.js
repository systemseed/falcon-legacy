import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';


class VideoPlayer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      playing: false,
    };

    this.playPause = this.playPause.bind(this);
  }

  playPause = () => {
    this.setState({ playing: !this.state.playing })
  }

  render() {
    const { videoUrl, posterUrl } = this.props;
    let posterStyle= {};
    if (!videoUrl) {
      return null;
    }
    if (posterUrl !== undefined) {
      posterStyle = {
        backgroundImage: 'url(' + posterUrl + ')',
        display: this.state.playing ? 'none' : 'block'
      };
    }
    return(
      <div className="video-player-block">
        <ReactPlayer
          url={videoUrl}
          className='video-player'
          width='100%'
          height='100%'
          controls
          playing={this.state.playing}
        />
        { posterUrl && <div className="poster" style={posterStyle} onClick={this.playPause} /> }
      </div>
    );
  }
}

VideoPlayer.propTypes = {
  videoUrl: PropTypes.string,
  posterUrl: PropTypes.string,
};

export default VideoPlayer;
