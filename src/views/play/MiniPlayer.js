import React from "react"
import { CSSTransition } from "react-transition-group"
import Progress from "./Progress"

import "./miniplayer.styl"

class MiniPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.miniPlayerRef = React.createRef();
  }
  handlePlayOrPause = (e) => {
    e.stopPropagation();
    if (this.props.song.url) {
      // 调用父组件的播放或暂停方法
      this.props.playOrPause();
    }
  }
  handleNext = (e) => {
    e.stopPropagation();

    if (this.props.song.url) {
      // 调用父组件播放下一首方法
      this.props.next();
    }
  }
  handleShow = () => {
    if (this.props.song.url) {
      this.props.showMiniPlayer();
    }
  }
  render() {
    let song = this.props.song;

    if (!song.img) {
      song.img = require("../../assets/imgs/music.png");
    }

    let imgStyle = {};
    if (song.playStatus === true) {
      imgStyle.WebkitAnimationPlayState = "running";
      imgStyle.animationPlayState = "running";
    } else {
      imgStyle.WebkitAnimationPlayState = "paused";
      imgStyle.animationPlayState = "paused";
    }

    let playButtonClass = song.playStatus === true ? "icon-pause" : "icon-play";
    return (
      <CSSTransition in={!this.props.showStatus} timeout={300} classNames="mini-player-translate"
        onEnter={() => {
          this.miniPlayerRef.current.style.display = "block";
        }}
        onExited={() => {
          this.miniPlayerRef.current.style.display = "none";
        }}>
        <div className="mini-player skin-mini-player" onClick={this.handleShow} ref={this.miniPlayerRef}>
          <div className="player-img rotate" style={imgStyle}>
            <img src={song.img} alt={song.name} />
          </div>
          <div className="player-center">
            <div className="progress-wrapper">
              <Progress disableButton={true} disableClick={true} progress={this.props.progress} />
            </div>
            <span className="song">
              {song.name}
            </span>
            <span className="singer">
              {song.singer}
            </span>
          </div>
          <div className="player-right">
            <i className={playButtonClass} onClick={this.handlePlayOrPause}></i>
            <i className="icon-next ml-16" onClick={this.handleNext}></i>
          </div>
          <div className="filter"></div>
        </div>
      </CSSTransition>
    );
  }
}

export default MiniPlayer
