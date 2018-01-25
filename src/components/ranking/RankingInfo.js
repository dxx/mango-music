import React from "react"
import ReactDOM from "react-dom"
import {CSSTransition} from "react-transition-group"
import {getTransitionEndName} from "@/util/event"
import Header from "@/common/header/Header"
import Scroll from "@/common/scroll/Scroll"
import Loading from "@/common/loading/Loading"
import {getRankingInfo} from "@/api/ranking"
import {getSongVKey} from "@/api/song"
import {CODE_SUCCESS} from "@/api/config"
import * as RankingModel from "@/model/ranking"
import * as SongModel from "@/model/song"

import "./rankinginfo.styl"

class RankingInfo extends React.Component {
	constructor(props) {
		super(props);

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
		let rankingBgDOM = ReactDOM.findDOMNode(this.refs.rankingBg);
		let rankingContainerDOM = ReactDOM.findDOMNode(this.refs.rankingContainer);
		rankingContainerDOM.style.top = rankingBgDOM.offsetHeight + "px";

		getRankingInfo(this.props.match.params.id).then((res) => {
			//console.log("获取排行榜详情：");
			if (res) {
				//console.log(res);
				if (res.code === CODE_SUCCESS) {
					let ranking = RankingModel.createRankingByDetail(res.topinfo);
					ranking.info = res.topinfo.info;
					let songList = [];
					res.songlist.forEach(item => {
						if (item.data.pay.payplay === 1) { return }
						let song = SongModel.createSong(item.data);
						//获取歌曲vkey
						this.getSongUrl(song, item.data.songmid);
						songList.push(song);
					});

					this.setState({
						loading: false,
						ranking: ranking,
						songs: songList
					}, () => {
						//刷新scroll
						this.setState({refreshScroll:true});
					});
				}
			}
		});
		this.initMusicIco();
	}
	getSongUrl(song, mId) {
		getSongVKey(mId).then((res) => {
			if (res) {
				if(res.code === CODE_SUCCESS) {
					if(res.data.items) {
						let item = res.data.items[0];
						song.url =  `http://dl.stream.qqmusic.qq.com/${item.filename}?vkey=${item.vkey}&guid=3655047200&fromtag=66`
					}
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
	/**
	 * 选择歌曲
	 */
	selectSong(song) {
		return (e) => {
			this.props.setSongs([song]);
			this.props.changeCurrentSong(song);
			this.startMusicIcoAnimation(e.nativeEvent);
		};
	}
	/**
	 * 播放全部
	 */
	playAll = () => {
		if (this.state.songs.length > 0) {
			//添加播放歌曲列表
			this.props.setSongs(this.state.songs);
			this.props.changeCurrentSong(this.state.songs[0]);
			this.props.showMusicPlayer(true);
		}
	}
	/**
	 * 监听scroll
	 */
	scroll = ({y}) => {
		let rankingBgDOM = ReactDOM.findDOMNode(this.refs.rankingBg);
		let rankingFixedBgDOM = ReactDOM.findDOMNode(this.refs.rankingFixedBg);
		let playButtonWrapperDOM = ReactDOM.findDOMNode(this.refs.playButtonWrapper);
		if (y < 0) {
			if (Math.abs(y) + 55 > rankingBgDOM.offsetHeight) {
				rankingFixedBgDOM.style.display = "block";
			} else {
				rankingFixedBgDOM.style.display = "none";
			}
		} else {
			let transform = `scale(${1 + y * 0.004}, ${1 + y * 0.004})`;
			rankingBgDOM.style["webkitTransform"] = transform;
			rankingBgDOM.style["transform"] = transform;
			playButtonWrapperDOM.style.marginTop = `${y}px`;
		}
	}
	render() {
		let ranking = this.state.ranking;
		let songs = this.state.songs.map((song, index) => {
			return (
				<div className="song" key={song.id} onClick={this.selectSong(song)}>
					<div className="song-index">{index + 1}</div>
					<div className="song-name">{song.name}</div>
					<div className="song-singer">{song.singer}</div>
				</div>
			);
		});
		return (
			<CSSTransition in={this.state.show} timeout={300} classNames="translate">
			<div className="ranking-info">
				<Header title={ranking.title}></Header>
				<div style={{position:"relative"}}>
					<div ref="rankingBg" className="ranking-img" style={{backgroundImage: `url(${ranking.img})`}}>
						<div className="filter"></div>
					</div>
					<div ref="rankingFixedBg" className="ranking-img fixed" style={{backgroundImage: `url(${ranking.img})`}}>
						<div className="filter"></div>
					</div>
					<div className="play-wrapper" ref="playButtonWrapper">
						<div className="play-button" onClick={this.playAll}>
							<i className="icon-play"></i>
							<span>播放全部</span>
						</div>
					</div>
				</div>
				<div ref="rankingContainer" className="ranking-container">
					<div className="ranking-scroll" style={this.state.loading === true ? {display:"none"} : {}}>
						<Scroll refresh={this.state.refreshScroll} onScroll={this.scroll}>
							<div className="ranking-wrapper skin-detail-wrapper">
								<div className="ranking-count">排行榜 共{songs.length}首</div>
								<div className="song-list">
									{songs}
								</div>
								<div className="info" style={ranking.info ? {} : {display:"none"}}>
									<h1 className="ranking-title">简介</h1>
									<div className="ranking-desc">
										{ranking.info}
									</div>
								</div>
							</div>
						</Scroll>
					</div>
					<Loading title="正在加载..." show={this.state.loading}/>
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
			</div>
			</CSSTransition>
		);
	}
}

export default RankingInfo