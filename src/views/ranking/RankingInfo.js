import React from "react"
import { CSSTransition } from "react-transition-group"
import Header from "../../components/header/Header"
import Scroll from "../../components/scroll/Scroll"
import Loading from "../../components/loading/Loading"
import MusicalNote from "../../components/note/MusicalNote"
import { getRankingInfo } from "../../api/ranking"
import { getSongVKey } from "../../api/song"
import { CODE_SUCCESS } from "../../api/config"
import * as RankingModel from "../../models/ranking"
import * as SongModel from "../../models/song"

import style from "./rankinginfo.styl?module"

class RankingInfo extends React.Component {
  constructor(props) {
    super(props);

    this.rankingBgRef = React.createRef();
    this.rankingContainerRef = React.createRef();
    this.rankingFixedBgRef = React.createRef();
    this.playButtonWrapperRef = React.createRef();
    this.musicalNoteRef = React.createRef();

    this.state = {
      show: false,
      loading: true,
      ranking: {},
      songs: [],
      refreshScroll: false
    }
  }
  componentDidMount() {
    this.setState({
      show: true
    });
    this.rankingContainerRef.current.style.top = this.rankingBgRef.current.offsetHeight + "px";
  }
  getRankingInfo() {
    getRankingInfo(this.props.match.params.id).then((res) => {
      // console.log("获取排行榜详情：");
      if (res) {
        // console.log(res);
        if (res.code === CODE_SUCCESS) {
          let ranking = RankingModel.createRankingByDetail(res.topinfo);
          ranking.info = res.topinfo.info;
          let songList = [];
          res.songlist.forEach(item => {
            if (item.data.pay.payplay === 1) { return }
            let song = SongModel.createSong(item.data);
            // 获取歌曲vkey
            this.getSongUrl(song, item.data.songmid);
            songList.push(song);
          });

          this.setState({
            loading: false,
            ranking: ranking,
            songs: songList
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
    let rankingBgDOM = this.rankingBgRef.current;
    let rankingFixedBgDOM = this.rankingFixedBgRef.current;
    let playButtonWrapperDOM = this.playButtonWrapperRef.current;
    if (y < 0) {
      if (Math.abs(y) + 55 > rankingBgDOM.offsetHeight) {
        rankingFixedBgDOM.style.display = "block";
      } else {
        rankingFixedBgDOM.style.display = "none";
      }
    } else {
      let transform = `scale(${1 + y * 0.004}, ${1 + y * 0.004})`;
      rankingBgDOM.style.webkitTransform = transform;
      rankingBgDOM.style.transform = transform;
      playButtonWrapperDOM.style.marginTop = `${y}px`;
    }
  }
  render() {
    let ranking = this.state.ranking;
    let imgStyle = {};
    if (ranking.img) {
      imgStyle.backgroundImage = `url(${ranking.img})`;
    }
    let songs = this.state.songs.map((song, index) => {
      return (
        <div className={style.song} key={song.id} onClick={this.selectSong(song)}>
          <div className={style.songIndex}>{index + 1}</div>
          <div className="song-name">{song.name}</div>
          <div className="song-singer">{song.singer}</div>
        </div>
      );
    });
    return (
      <CSSTransition in={this.state.show} timeout={300} classNames="translate"
        onEntered={ () => {
          // 进入动画结束后获取数据再渲染，避免大数量渲染造成动画卡顿
          this.getRankingInfo();
        }}>
        <div className="ranking-info">
          <Header title={ranking.title}></Header>
          <div style={{ position: "relative" }}>
            <div ref={this.rankingBgRef} className={style.rankingImg} style={imgStyle}>
              <div className={style.filter}></div>
            </div>
            <div ref={this.rankingFixedBgRef} className={style.rankingImg + " " + style.fixed} style={imgStyle}>
              <div className={style.filter}></div>
            </div>
            <div className={style.playWrapper} ref={this.playButtonWrapperRef}>
              <div className={style.playButton} onClick={this.playAll}>
                <i className="icon-play"></i>
                <span>播放全部</span>
              </div>
            </div>
          </div>
          <div ref={this.rankingContainerRef} className={style.rankingContainer}>
            <div className={style.rankingScroll} style={this.state.loading === true ? { display: "none" } : {}}>
              <Scroll refresh={this.state.refreshScroll} onScroll={this.scroll}>
                <div className={`${style.rankingWrapper} skin-detail-wrapper`}>
                  <div className={style.rankingCount}>排行榜 共{songs.length}首</div>
                  <div className={style.songList}>
                    {songs}
                  </div>
                  <div className={style.info} style={ranking.info ? {} : { display: "none" }}>
                    <h1 className={style.rankingTitle}>简介</h1>
                    <div className={style.rankingDesc} dangerouslySetInnerHTML={{__html: ranking.info}}>
                    </div>
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

export default RankingInfo
