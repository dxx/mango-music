import React from "react"
import { CSSTransition } from "react-transition-group"
import Scroll from "@/common/scroll/Scroll"

import "./playerlist.styl"

class PlayerList extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			showList: false
		};
	}
	componentDidUpdate() {
		//重置当前歌曲位置
		if (this.props.playSongs.length === 1) {this.props.changeCurrentIndex(0)};
	}
	showOrHidePlayList = () => {
		this.props.showList(false);
	}
	/**
	 * 播放当前歌曲
	 */
	playSong(song, index) {
		return () => {
			this.props.changeCurrentSong(song);
			this.props.changeCurrentIndex(index);
			
			this.showOrHidePlayList();
		};
	}
	/**
	 * 移除歌曲
	 */
	removeSong(id, index) {
		return () => {
			if (this.props.currentSong.id !== id) {
				this.props.removeSong(id);
				if (index < this.props.currentIndex) {
					//调用父组件修改当前歌曲位置
					this.props.changeCurrentIndex(this.props.currentIndex - 1);
				}
			}
		};
	}
	render() {
		let playList = this.props.playSongs;
		return (
			<div className="player-list">
				<CSSTransition in={this.props.show} classNames="fade" timeout={500} 
					onEnter={() => {
						this.setState({showList:true});
					}}
					onEntered={() => {
						this.refs.scroll.refresh();
					}}
					onExited={() => {this.setState({showList:false})}}>
				<div className="play-list-bg" style={this.state.showList === true ? {display:"block"} : {display:"none"}}
				onClick={this.showOrHidePlayList}>
					{/*播放列表*/}
					<div className="play-list-wrap" onClick={e => e.stopPropagation()}>
						<div className="play-list-head">
							<span className="head-title">播放列表</span>
							<span className="close" onClick={this.showOrHidePlayList}>关闭</span>
						</div>
						<div className="play-list">
							<Scroll ref="scroll">
							<div>
							{
								playList.map((song, index) => {
									return (
										<div className="play-list-item" key={song.id}>
											<div className="item-left">{index + 1 < 10 ? `0${index + 1}` : index + 1}</div>
											<div className="item-right">
												<div className={index === this.props.currentIndex ? "song current" : "song"} onClick={this.playSong(song, index)}>
													<span className="song-name">{song.name}</span>
													<span className="song-singer">{song.singer}</span>
												</div>
												<i className="icon-delete delete" onClick={this.removeSong(song.id, index)}></i>
											</div>
										</div>
									);
								})
							}
							</div>
							</Scroll>
						</div>
					</div>
				</div>
				</CSSTransition>
			</div>
		);
	}
}

export default PlayerList