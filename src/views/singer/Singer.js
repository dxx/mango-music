import React from "react"
import { CSSTransition } from "react-transition-group"
import Header from "../../components/header/Header"
import Scroll from "../../components/scroll/Scroll"
import Loading from "../../components/loading/Loading"
import MusicalNote from "../../components/note/MusicalNote"
import { getSingerInfo } from "../../api/singer"
import { getSongVKey } from "../../api/song"
import { CODE_SUCCESS } from "../../api/config"
import * as SingerModel from "../../models/singer"
import * as SongModel from "../../models/song"

import style from "./singer.styl?module"

class Singer extends React.Component {
  constructor(props) {
    super(props);

    this.singerBgRef = React.createRef();
    this.singerContainerRef = React.createRef();
    this.singerFixedBgRef = React.createRef();
    this.playButtonWrapperRef = React.createRef();
    this.musicalNoteRef = React.createRef();

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
    this.singerContainerRef.current.style.top = this.singerBgRef.current.offsetHeight + "px";
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
      this.musicalNoteRef.current.startAnimation({
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
    let singerBgDOM = this.singerBgRef.current;
    let singerFixedBgDOM = this.singerFixedBgRef.current;
    let playButtonWrapperDOM = this.playButtonWrapperRef.current;
    if (y < 0) {
      if (Math.abs(y) + 55 > singerBgDOM.offsetHeight) {
        singerFixedBgDOM.style.display = "block";
      } else {
        singerFixedBgDOM.style.display = "none";
      }
    } else {
      let transform = `scale(${1 + y * 0.004}, ${1 + y * 0.004})`;
      singerBgDOM.style.webkitTransform = transform;
      singerBgDOM.style.transform = transform;
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
        <div className={style.song} key={song.id} onClick={this.selectSong(song)}>
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
            <div ref={this.singerBgRef} className={style.singerImg} style={imgStyle}>
              <div className={style.filter}></div>
            </div>
            <div ref={this.singerFixedBgRef} className={style.singerImg + " " + style.fixed} style={imgStyle}>
              <div className={style.filter}></div>
            </div>
            <div className={style.playWrapper} ref={this.playButtonWrapperRef}>
              <div className={style.playButton} onClick={this.playAll}>
                <i className="icon-play"></i>
                <span>播放全部</span>
              </div>
            </div>
          </div>
          <div ref={this.singerContainerRef} className={style.singerContainer}>
            <div className={style.singerScroll} style={this.state.loading === true ? { display: "none" } : {}}>
              <Scroll refresh={this.state.refreshScroll} onScroll={this.scroll}>
                <div className={`${style.singerWrapper} skin-detail-wrapper`}>
                  <div className={style.songCount}>歌曲 共{songs.length}首</div>
                  <div className={style.songList}>
                    {songs}
                  </div>
                </div>
              </Scroll>
            </div>
            <Loading title="正在加载..." show={this.state.loading} />
          </div>
          <MusicalNote ref={this.musicalNoteRef}/>
        </div>
      </CSSTransition>
    );
  }
}

export default Singer
