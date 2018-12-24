import React from "react"
import { CSSTransition } from "react-transition-group"
import Header from "@/common/header/Header"
import Scroll from "@/common/scroll/Scroll"
import Loading from "@/common/loading/Loading"
import MusicalNote from "@/common/note/MusicalNote"
import { getSingerInfo } from "@/api/singer"
import { getSongVKey } from "@/api/song"
import { CODE_SUCCESS } from "@/api/config"
import * as SingerModel from "@/model/singer"
import * as SongModel from "@/model/song"

import "./singer.styl"

class Singer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      loading: true,
      singer: {},
      songs: [],
      refreshScroll: false
    }
  }
  componentDidMount() {
    this.setState({
      show: true
    });
    this.singerContainerDOM.style.top = this.singerBgDOM.offsetHeight + "px";
  }
  getSingerInfo() {
    getSingerInfo(this.props.match.params.id).then((res) => {
      // console.log("获取歌手详情：");
      if (res) {
        // console.log(res);
        if (res.code === CODE_SUCCESS) {
          let singer = SingerModel.createSingerByDetail(res.data);
          singer.desc = res.data.desc;

          let songList = res.data.list;
          let songs = [];
          songList.forEach(item => {
            if (item.musicData.pay.payplay === 1) { return }
            let song = SongModel.createSong(item.musicData);
            // 获取歌曲vkey
            this.getSongUrl(song, song.mId);
            songs.push(song);
          });
          this.setState({
            loading: false,
            singer: singer,
            songs: songs
          }, () => {
            // 刷新scroll
            this.setState({ refreshScroll: true });
          });
        }
      }
    });
  }
  getSongUrl(song, mId) {
    getSongVKey(mId).then((res) => {
      if (res) {
        if (res.code === CODE_SUCCESS) {
          if (res.data.items) {
            let item = res.data.items[0];
            song.url = `http://dl.stream.qqmusic.qq.com/${item.filename}?vkey=${item.vkey}&guid=3655047200&fromtag=66`
          }
        }
      }
    });
  }
  /**
   * 选择歌曲
   */
  selectSong(song) {
    return (e) => {
      this.props.setSongs([song]);
      this.props.changeCurrentSong(song);
      this.musicalNote.startAnimation({
        x: e.nativeEvent.clientX,
        y: e.nativeEvent.clientY
      });
    };
  }
  /**
   * 播放全部
   */
  playAll = () => {
    if (this.state.songs.length > 0) {
      // 添加播放歌曲列表
      this.props.setSongs(this.state.songs);
      this.props.changeCurrentSong(this.state.songs[0]);
      this.props.showMusicPlayer(true);
    }
  }
  /**
   * 监听scroll
   */
  scroll = ({ y }) => {
    let singerBgDOM = this.singerBgDOM;
    let singerFixedBgDOM = this.singerFixedBgDOM;
    let playButtonWrapperDOM = this.playButtonWrapperDOM;
    if (y < 0) {
      if (Math.abs(y) + 55 > singerBgDOM.offsetHeight) {
        singerFixedBgDOM.style.display = "block";
      } else {
        singerFixedBgDOM.style.display = "none";
      }
    } else {
      let transform = `scale(${1 + y * 0.004}, ${1 + y * 0.004})`;
      singerBgDOM.style["webkitTransform"] = transform;
      singerBgDOM.style["transform"] = transform;
      playButtonWrapperDOM.style.marginTop = `${y}px`;
    }
  }
  render() {
    let singer = this.state.singer;
    let imgStyle = {};
    if (singer.img) {
      imgStyle.backgroundImage = `url(${singer.img})`;
    }
    let songs = this.state.songs.map((song) => {
      return (
        <div className="song" key={song.id} onClick={this.selectSong(song)}>
          <div className="song-name">{song.name}</div>
          <div className="song-singer">{song.singer}</div>
        </div>
      );
    });
    return (
      <CSSTransition in={this.state.show} timeout={300} classNames="translate"
        onEntered={ () => {
          this.getSingerInfo();
        }}>
        <div className="music-singer">
          <Header title={singer.name}></Header>
          <div style={{ position: "relative" }}>
            <div ref={(el) => { this.singerBgDOM = el; }} className="singer-img" style={imgStyle}>
              <div className="filter"></div>
            </div>
            <div ref={(el) => { this.singerFixedBgDOM = el; }} className="singer-img fixed" style={imgStyle}>
              <div className="filter"></div>
            </div>
            <div className="play-wrapper" ref={(el) => { this.playButtonWrapperDOM = el; }}>
              <div className="play-button" onClick={this.playAll}>
                <i className="icon-play"></i>
                <span>播放全部</span>
              </div>
            </div>
          </div>
          <div ref={(el) => { this.singerContainerDOM = el; }} className="singer-container">
            <div className="singer-scroll" style={this.state.loading === true ? { display: "none" } : {}}>
              <Scroll refresh={this.state.refreshScroll} onScroll={this.scroll}>
                <div className="singer-wrapper skin-detail-wrapper">
                  <div className="song-count">歌曲 共{songs.length}首</div>
                  <div className="song-list">
                    {songs}
                  </div>
                </div>
              </Scroll>
            </div>
            <Loading title="正在加载..." show={this.state.loading} />
          </div>
          <MusicalNote ref={(el) => { this.musicalNote = el; }}/>
        </div>
      </CSSTransition>
    );
  }
}

export default Singer
