import React from "react"
import { renderRoutes } from "react-router-config"
import Scroll from "../../components/scroll/Scroll"
import Loading from "../../components/loading/Loading"
import MusicalNote from "../../components/note/MusicalNote"
import { getHotKey, search } from "../../api/search"
import { getSongVKey } from "../../api/song"
import { CODE_SUCCESS } from "../../api/config"
import * as SingerModel from "../../models/singer"
import * as AlbumModel from "../../models/album"
import * as SongModel from "../../models/song"

import style from "./search.styl?module"

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.musicalNoteRef = React.createRef();

    this.state = {
      hotKeys: [],
      singer: {},
      album: {},
      songs: [],
      w: "",
      loading: false
    };
  }
  componentDidMount() {
    getHotKey().then((res) => {
      // console.log("获取热搜：");
      if (res) {
        // console.log(res);
        if (res.code === CODE_SUCCESS) {
          this.setState({
            hotKeys: res.data.hotkey
          });
        }
      }
    });
  }
  handleSearch = (k) => {
    return () => {
      this.search(k);
    }
  }
  handleInput = (e) => {
    let w = e.currentTarget.value;
    this.setState({
      w,
      singer: {},
      album: {},
      songs: []
    });
  }
  handleClick = (data, type) => {
    return (e) => {
      switch (type) {
        case "album":
          // 跳转到专辑详情
          this.props.history.push({
            pathname: `${this.props.match.url}/album/${data}`
          });
          break;
        case "singer":
          // 跳转到歌手详情
          this.props.history.push({
            pathname: `${this.props.match.url}/singer/${data}`
          });
          break;
        case "song":
          this.musicalNoteRef.current.startAnimation({
            x: e.nativeEvent.clientX,
            y: e.nativeEvent.clientY
          });
          getSongVKey(data.mId).then((res) => {
            if (res) {
              if (res.code === CODE_SUCCESS) {
                if (res.data.items) {
                  let item = res.data.items[0];
                  data.url = `http://dl.stream.qqmusic.qq.com/${item.filename}?vkey=${item.vkey}&guid=3655047200&fromtag=66`;

                  this.props.setSongs([data]);
                  this.props.changeCurrentSong(data);
                }
              }
            }
          });
          break;
        default:
          break;
      }
    }
  }
  search = (w) => {
    this.setState({ w, loading: true });
    search(w).then((res) => {
      // console.log("搜索：");
      if (res) {
        // console.log(res);
        if (res.code === CODE_SUCCESS) {
          let zhida = res.data.zhida;
          let type = zhida.type;
          let singer = {};
          let album = {};
          switch (type) {
            // 0：表示歌曲
            case 0:
              break;
            // 1：表示歌手
            case 1:
              let zhiDaSinger = zhida.zhida_singer;
              singer = SingerModel.createSingerBySearch(zhiDaSinger);
              singer.songNum = zhiDaSinger.songNum;
              singer.albumNum = zhiDaSinger.albumNum;
              break;
            // 2: 表示专辑
            case 2:
              let zhiDaAlbum = zhida.zhida_album;
              album = AlbumModel.createAlbumBySearch(zhiDaAlbum);
              break;
            default:
              break;
          }

          let songs = [];
          res.data.song.list.forEach((data) => {
            if (data.pay.payplay === 1) { return }
            songs.push(SongModel.createSong(data));
          });
          this.setState({
            album: album,
            singer: singer,
            songs: songs,
            loading: false
          }, () => {
            this.refs.scroll.refresh();
          });
        }
      }
    });
  }
  render() {
    let album = this.state.album;
    let singer = this.state.singer;
    return (
      <div className="music-search skin-search">
        <div className={`${style.searchBoxWrapper} skin-search-box-wrapper`}>
          <div className={`${style.searchBox} skin-search-box`}>
            <i className="icon-search"></i>
            <input type="text" className={style.searchInput} placeholder="搜索歌曲、歌手、专辑"
              value={this.state.w}
              onChange={this.handleInput}
              onKeyDown={
                (e) => {
                  if (e.keyCode === 13) {
                    this.search(e.currentTarget.value);
                  }
                }
              } />
          </div>
          <div className={style.cancelButton} style={{ display: this.state.w ? "block" : "none" }}
            onClick={() => this.setState({ w: "", singer: {}, album: {}, songs: [] })}>取消</div>

        </div>
        <div className={style.searchHot} style={{ display: this.state.w ? "none" : "block" }}>
          <h1 className="title">热门搜索</h1>
          <div className={style.hotList}>
            {
              this.state.hotKeys.map((hot, index) => {
                if (index > 10) return "";
                return (
                  <div className="hot-item" key={index} onClick={this.handleSearch(hot.k)}>{hot.k}</div>
                );
              })
            }
          </div>
        </div>
        <div className={`${style.searchResult} skin-search-result`} style={{ display: this.state.w ? "block" : "none" }}>
          <Scroll ref="scroll">
            <div>
              {/*专辑*/}
              <div className="album-wrapper" style={{ display: album.id ? "block" : "none" }}
                onClick={this.handleClick(album.mId, "album")}>
                <div className={style.left}>
                  <img src={album.img} alt={album.name} />
                </div>
                <div className={style.right}>
                  <div className="song">{album.name}</div>
                  <div className="singer">{album.singer}</div>
                </div>
              </div>
              {/* 歌手 */}
              <div className="singer-wrapper" style={{ display: singer.id ? "block" : "none" }}
                onClick={this.handleClick(singer.mId, "singer")}>
                <div className={style.left}>
                  <img src={singer.img} alt={singer.name} />
                </div>
                <div className={style.right}>
                  <div className="singer">{singer.name}</div>
                  <div className="info">单曲{singer.songNum} 专辑{singer.albumNum}</div>
                </div>
              </div>
              {/* 歌曲列表 */}
              {
                this.state.songs.map((song) => {
                  return (
                    <div className="song-wrapper" key={song.id} onClick={this.handleClick(song, "song")}>
                      <div className={style.left}>
                        <i className="icon-fe-music"></i>
                      </div>
                      <div className={style.right}>
                        <div className="song">{song.name}</div>
                        <div className="singer">{song.singer}</div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
            <Loading title="正在加载..." show={this.state.loading} />
          </Scroll>
        </div>
        <MusicalNote ref={this.musicalNoteRef}/>
        { renderRoutes(this.props.route.routes) }
      </div>
    );
  }
}

export default Search
