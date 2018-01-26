import React from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';


class VideoPlayer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      playing: false,
      loading: false,
      hidePoster: false
    };

    this.playVideo = this.playVideo.bind(this);
  }

  playVideo = () => {
    if (!this.state.playing) {
      // Will replace Play button to Loading.
      this.setState({loading: true, playing: true});

      // Will hide poster with animation (opacity:0).
      setTimeout(() => {
        this.setState({loading: false})
      }, 1000);

      // Will completely hide poster with display:none.
      setTimeout(() => {
        this.setState({hidePoster: true})
      }, 1200);
    }
  }

  render() {
    const { videoUrl, posterUrl } = this.props;
    if (!videoUrl) {
      return null;
    }
    let blockClasses = ['video-player-block'];
    if (this.state.loading) {
      blockClasses.push('loading');
    }
    if (this.state.playing) {
      blockClasses.push('playing');
    }
    if (this.state.hidePoster) {
      blockClasses.push('hide-poster');
    }

    return(
      <div className={blockClasses.join(' ')}>
        <ReactPlayer
          url={videoUrl}
          className='video-player'
          width='100%'
          height='100%'
          controls
          playing={this.state.playing}
        />
        { posterUrl &&
          <div className="poster" style={{ backgroundImage: 'url(' + posterUrl + ')' }} onClick={this.playVideo}>
            <img className="play-button" src="/static/images/play-button.svg" />
            <img className="play-button--loading" src="/static/images/loading-circle.svg" />
          </div>
        }
      </div>
    );
  }
}

VideoPlayer.propTypes = {
  videoUrl: PropTypes.string,
  posterUrl: PropTypes.string,
};

export default VideoPlayer;
