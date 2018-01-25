import React from "react"
import ReactDOM from "react-dom"
import {Route} from "react-router-dom"
import {getTransitionEndName} from "@/util/event"
import Scroll from "@/common/scroll/Scroll"
import Loading from "@/common/loading/Loading"
import Album from "@/containers/Album"
import Singer from "@/containers/Singer"
import {getHotKey, search} from "@/api/search"
import {getSongVKey} from "@/api/song"
import {CODE_SUCCESS} from "@/api/config"
import * as SingerModel from "@/model/singer"
import * as AlbumModel from "@/model/album"
import * as SongModel from "@/model/song"

import "./search.styl"

class Search extends React.Component {
	constructor(props) {
		super(props);

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
			//console.log("获取热搜：");
			if (res) {
				//console.log(res);
				if (res.code === CODE_SUCCESS) {
					this.setState({
						hotKeys: res.data.hotkey
					});
				}
			}
		});
		this.initMusicIco();
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
					//跳转到专辑详情
					this.props.history.push({
						pathname: `${this.props.match.url}/album/${data}`
					});
					break;
				case "singer":
					//跳转到歌手详情
					this.props.history.push({
						pathname: `${this.props.match.url}/singer/${data}`
					});
					break;
				case "song":
					this.startMusicIcoAnimation(e.nativeEvent);
					getSongVKey(data.mId).then((res) => {
						if (res) {
							if(res.code === CODE_SUCCESS) {
								if(res.data.items) {
									let item = res.data.items[0];
									data.url =  `http://dl.stream.qqmusic.qq.com/${item.filename}?vkey=${item.vkey}&guid=3655047200&fromtag=66`;

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
		this.setState({w, loading: true});
		search(w).then((res) => {
			//console.log("搜索：");
			if (res) {
				//console.log(res);
				if (res.code === CODE_SUCCESS) {
					let zhida = res.data.zhida;
					let type = zhida.type;
					let singer = {};
					let album = {};
					switch (type) {
						//0：表示歌曲
						case 0:
							break;
						//2：表示歌手
						case 2:
							singer = SingerModel.createSingerBySearch(zhida);
							singer.songnum = zhida.songnum;
							singer.albumnum = zhida.albumnum;
							break;
						//3: 表示专辑
						case 3:
							album = AlbumModel.createAlbumBySearch(zhida);
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
	/**
	 * 初始化音符图标
	 */
	initMusicIco() {
		this.musicIcos = [];
		this.musicIcos.push(ReactDOM.findDOMNode(this.refs.musicIco1));
		this.musicIcos.push(ReactDOM.findDOMNode(this.refs.musicIco2));
		this.musicIcos.push(ReactDOM.findDOMNode(this.refs.musicIco3));

		this.musicIcos.forEach((item) => {
			//初始化状态
			item.run = false;
			let transitionEndName = getTransitionEndName(item);
			item.addEventListener(transitionEndName, function() {
				this.style.display = "none";
				this.style["webkitTransform"] = "translate3d(0, 0, 0)";
				this.style["transform"] = "translate3d(0, 0, 0)";
				this.run = false;

				let icon = this.querySelector("div");
				icon.style["webkitTransform"] = "translate3d(0, 0, 0)";
				icon.style["transform"] = "translate3d(0, 0, 0)";
			}, false);
		});
	}
	/**
	 * 开始音符下落动画
	 */
	startMusicIcoAnimation({clientX, clientY}) {
		if (this.musicIcos.length > 0) {
			for (let i = 0; i < this.musicIcos.length; i++) {
				let item = this.musicIcos[i];
				//选择一个未在动画中的元素开始动画
				if (item.run === false) {
					item.style.top = clientY + "px";
					item.style.left = clientX + "px";
					item.style.display = "inline-block";
					setTimeout(() => {
						item.run = true;
						item.style["webkitTransform"] = "translate3d(0, 1000px, 0)";
						item.style["transform"] = "translate3d(0, 1000px, 0)";

						let icon = item.querySelector("div");
						icon.style["webkitTransform"] = "translate3d(-30px, 0, 0)";
						icon.style["transform"] = "translate3d(-30px, 0, 0)";
					}, 10);
					break;
				}
			}
		}
	}
	render() {
		let album = this.state.album;
		let singer = this.state.singer;
		return (
			<div className="music-search skin-search">
				<div className="search-box-wrapper skin-search-box-wrapper">
					<div className="search-box skin-search-box">
						<i className="icon-search"></i>
						<input type="text" className="search-input" placeholder="搜索歌曲、歌手、专辑" 
						value={this.state.w}
						onChange={this.handleInput}
						onKeyDown={
							(e) => {
								if (e.keyCode === 13) {
									this.search(e.currentTarget.value);
								}
							}
						}/>
					</div>
					<div className="cancel-button" style={{display: this.state.w ? "block" : "none"}}
					onClick={() => this.setState({w:"", singer:{}, album:{}, songs:[]})}>取消</div>
					
				</div>
				<div className="search-hot" style={{display: this.state.w ? "none" : "block"}}>
					<h1 className="title">热门搜索</h1>
					<div className="hot-list">
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
				<div className="search-result skin-search-result" style={{display: this.state.w ? "block" : "none"}}>
					<Scroll ref="scroll">
						<div>
						{/*专辑*/}
						<div className="album-wrapper" style={{display:album.id ? "block" : "none"}}
						onClick={this.handleClick(album.mId, "album")}>
							<div className="left">
								<img src={album.img} alt={album.name}/>
							</div>
							<div className="right">
								<div className="song">{album.name}</div>
								<div className="singer">{album.singer}</div>
							</div>
						</div>
						{/*歌手*/}
						<div className="singer-wrapper" style={{display:singer.id ? "block" : "none"}}
						onClick={this.handleClick(singer.mId, "singer")}>
							<div className="left">
								<img src={singer.img} alt={singer.name}/>
							</div>
							<div className="right">
								<div className="singer">{singer.name}</div>
								<div className="info">单曲{singer.songnum} 专辑{singer.albumnum}</div>
							</div>
						</div>
						{/*歌曲列表*/}
						{
							this.state.songs.map((song) => {
								return (
									<div className="song-wrapper" key={song.id} onClick={this.handleClick(song, "song")}>
										<div className="left">
											<i className="icon-fe-music"></i>
										</div>
										<div className="right">
											<div className="song">{song.name}</div>
											<div className="singer">{song.singer}</div>
										</div>
									</div>
								);
							})
						}
						</div>
						<Loading title="正在加载..." show={this.state.loading}/>
					</Scroll>
				</div>
				<div className="music-ico" ref="musicIco1">
					<div className="icon-fe-music"></div>
				</div>
				<div className="music-ico" ref="musicIco2">
					<div className="icon-fe-music"></div>
				</div>
				<div className="music-ico" ref="musicIco3">
					<div className="icon-fe-music"></div>
				</div>
				<Route path={`${this.props.match.url + '/album/:id'}`} component={Album} />
				<Route path={`${this.props.match.url + '/singer/:id'}`} component={Singer} />
			</div>
		);
	}
}

export default Search