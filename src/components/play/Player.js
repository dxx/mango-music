import React from "react"
import ReactDOM from "react-dom"
import { CSSTransition } from "react-transition-group"
import Progress from "./Progress"
import MiniPlayer from "./MiniPlayer"
import {Song} from "@/model/song"

import "./player.styl"

class Player extends React.Component {
    constructor(props) {
        super(props);

        this.currentSong = new Song( 0, "", "", "", 0, "", "");
        this.currentIndex = 0;
        //拖拽进度
        this.dragProgress = 0;
        this.isFirstPlay = true;

        //播放模式： list-列表 single-单曲 shuffle-随机
        this.playModes = ["list", "single", "shuffle"];

        this.state = {
            currentTime: 0,
            playProgress: 0,
            playStatus: false,
            currentPlayMode: 0
        }
    }
    componentDidUpdate() {
        //兼容手机端canplay事件触发后第一次调用play()方法无法自动播放的问题
        if (this.isFirstPlay === true) {
            this.audioDOM.play();
            this.isFirstPlay = false;
        }
    }
    componentDidMount() {
        this.audioDOM = ReactDOM.findDOMNode(this.refs.audio);
        this.singerImgDOM = ReactDOM.findDOMNode(this.refs.singerImg);
        this.playerDOM = ReactDOM.findDOMNode(this.refs.player);
        this.playerBgDOM = ReactDOM.findDOMNode(this.refs.playerBg);

        this.audioDOM.addEventListener("canplay", () => {
            this.audioDOM.play();
            this.startImgRotate();

            this.setState({
                playStatus: true
            });

        }, false);

        this.audioDOM.addEventListener("timeupdate", () => {
            if (this.state.playStatus === true) {
                this.setState({
                    playProgress: this.audioDOM.currentTime / this.audioDOM.duration,
                    currentTime: this.audioDOM.currentTime
                });
            }
        }, false);

        this.audioDOM.addEventListener("ended", () => {
            if (this.props.playSongs.length > 1) {
                let currentIndex = this.currentIndex;
                if (this.state.currentPlayMode === 0) {  //列表播放
                    if(currentIndex === this.props.playSongs.length - 1){
                        currentIndex = 0;
                    }else{
                        currentIndex = currentIndex + 1;
                    }
                } else if (this.state.currentPlayMode === 1) {  //单曲循环
                    //继续播放当前歌曲
                    this.audioDOM.play();
                    return;
                } else {  //随机播放
                    let index = parseInt(Math.random() * this.props.playSongs.length, 10);
                    currentIndex = index;
                }
                this.props.changeCurrentSong(this.props.playSongs[currentIndex]);
                //调用父组件修改当前歌曲位置
                this.props.changeCurrentIndex(currentIndex);

            } else {
                if (this.state.currentPlayMode === 1) {  //单曲循环
                    //继续播放当前歌曲
                    this.audioDOM.play();
                } else {
                    //暂停
                    this.audioDOM.pause();
                    this.stopImgRotate();

                    this.setState({
                        playProgress: 0,
                        currentTime: 0,
                        playStatus: false
                    });
                }
            }
        }, false);

        this.audioDOM.addEventListener("error", () => {alert("加载歌曲出错！")}, false);
    }
    /**
     * 播放或暂停
     */
    playOrPause = () => {
        if(this.audioDOM.paused){
            this.audioDOM.play();
            this.startImgRotate();

            this.setState({
                playStatus: true
            });
        }else{
            this.audioDOM.pause();
            this.stopImgRotate();

            this.setState({
                playStatus: false
            });
        }
    }
    /**
     * 上一首
     */
    previous = () => {
        if (this.props.playSongs.length > 0 && this.props.playSongs.length !== 1) {
            let currentIndex = this.currentIndex;
            if (this.state.currentPlayMode === 0) {  //列表播放
                if(currentIndex === 0){
                    currentIndex = this.props.playSongs.length - 1;
                }else{
                    currentIndex = currentIndex - 1;
                }
            } else if (this.state.currentPlayMode === 1) {  //单曲循环
                currentIndex = this.currentIndex;
            } else {  //随机播放
                let index = parseInt(Math.random() * this.props.playSongs.length, 10);
                currentIndex = index;
            }
            this.props.changeCurrentSong(this.props.playSongs[currentIndex]);
            //调用父组件修改当前歌曲位置
            this.props.changeCurrentIndex(currentIndex);
        }
    }
    /**
     * 下一首
     */
    next = () => {
        if (this.props.playSongs.length > 0  && this.props.playSongs.length !== 1) {
            let currentIndex = this.currentIndex;
            if (this.state.currentPlayMode === 0) {  //列表播放
                if(currentIndex === this.props.playSongs.length - 1){
                    currentIndex = 0;
                }else{
                    currentIndex = currentIndex + 1;
                }
            } else if (this.state.currentPlayMode === 1) {  //单曲循环
                currentIndex = this.currentIndex;
            } else {  //随机播放
                let index = parseInt(Math.random() * this.props.playSongs.length, 10);
                currentIndex = index;
            }
            this.props.changeCurrentSong(this.props.playSongs[currentIndex]);
            //调用父组件修改当前歌曲位置
            this.props.changeCurrentIndex(currentIndex);
        }
    }
    /**
     * 开始旋转图片
     */
    startImgRotate = () => {
        if (this.singerImgDOM.className.indexOf("rotate") === -1) {
            this.singerImgDOM.classList.add("rotate");
        } else {
            this.singerImgDOM.style["webkitAnimationPlayState"] = "running";
            this.singerImgDOM.style["animationPlayState"] = "running";
        }
    }
    /**
     * 停止旋转图片
     */
    stopImgRotate = () => {
        this.singerImgDOM.style["webkitAnimationPlayState"] = "paused";
        this.singerImgDOM.style["animationPlayState"] = "paused";
    }
    /**
     * 显示播放列表
     */
    showPlayList = () => {
        this.props.showList(true);
    }
    /**
     * 隐藏播放器
     */
    hidePlayer = () => {
        this.props.showMusicPlayer(false);
    }
    /**
     * 显示播放器
     */
    showPlayer = () => {
        this.props.showMusicPlayer(true);
    }
    /**
     * 改变播放模式
     */
    changePlayMode = () => {
        if (this.state.currentPlayMode === this.playModes.length - 1) {
            this.setState({currentPlayMode:0});
        } else {
            this.setState({currentPlayMode:this.state.currentPlayMode + 1});
        }
    }
    /**
     * 开始拖拽
     */
    handleDrag = (progress) => {
        if (this.audioDOM.duration > 0) {
            this.audioDOM.pause();

            this.stopImgRotate();

            this.setState({
                playStatus: false
            });
            this.dragProgress = progress;
        }
    }
    /**
     * 拖拽结束
     */
    handleDragEnd = () => {
        if (this.audioDOM.duration > 0) {
            let currentTime = this.audioDOM.duration * this.dragProgress;
            this.setState({
                playProgress: this.dragProgress,
                currentTime: currentTime
            }, () => {
                this.audioDOM.currentTime = currentTime;
                this.audioDOM.play();

                this.startImgRotate();

                this.setState({
                    playStatus: true
                });
                this.dragProgress = 0;
            });
        }
    }
    render() {
        this.currentIndex = this.props.currentIndex;

        //从redux中获取当前播放歌曲
        if (this.props.currentSong && this.props.currentSong.url) {
            //当前歌曲发发生变化
            if (this.currentSong.id !== this.props.currentSong.id) {
                this.currentSong = this.props.currentSong;
                this.audioDOM.src = this.currentSong.url;
                //加载资源，ios需要调用此方法
                this.audioDOM.load();
            }
        }
        let song = this.currentSong;

        let playBg = song.img ? song.img : require("@/assets/imgs/play_bg.jpg");

        //播放按钮样式
        let playButtonClass = this.state.playStatus === true ? "icon-pause" : "icon-play";

        song.playStatus = this.state.playStatus;
        return (
            <div className="player-container">
                <CSSTransition in={this.props.showStatus} timeout={300} classNames="player-rotate"
                               onEnter={() => {
                                   this.playerDOM.style.display = "block";
                               }}
                               onExited={() => {
                                   this.playerDOM.style.display = "none";
                               }}>
                <div className="player" ref="player">
                    <div className="header">
                        <span className="header-back" onClick={this.hidePlayer}>
                            <i className="icon-back"></i>
                        </span>
                        <div className="header-title">
                            {song.name}
                        </div>
                    </div>
                    <div className="singer-top">
                        <div className="singer">
                            <div className="singer-name">{song.singer}</div>
                        </div>
                    </div>
                    <div className="singer-middle">
                        <div className="singer-img" ref="singerImg">
                            <img src={playBg} alt={song.name} onLoad={
                                (e) => {
                                    /*图片加载完成后设置背景，防止图片加载过慢导致没有背景*/
                                    this.playerBgDOM.style.backgroundImage = `url("${playBg}")`;
                                }
                            }/>
                        </div>
                    </div>
                    <div className="singer-bottom">
                        <div className="controller-wrapper">
                            <div className="progress-wrapper">
                                <span className="current-time">{getTime(this.state.currentTime)}</span>
                                <div className="play-progress">
                                    <Progress progress={this.state.playProgress}
                                              onDrag={this.handleDrag}
                                              onDragEnd={this.handleDragEnd}/>
                                </div>
                                <span className="total-time">{getTime(song.duration)}</span>
                            </div>
                            <div className="play-wrapper">
                                <div className="play-model-button"  onClick={this.changePlayMode}>
                                    <i className={"icon-" + this.playModes[this.state.currentPlayMode] + "-play"}></i>
                                </div>
                                <div className="previous-button" onClick={this.previous}>
                                    <i className="icon-previous"></i>
                                </div>
                                <div className="play-button" onClick={this.playOrPause}>
                                    <i className={playButtonClass}></i>
                                </div>
                                <div className="next-button" onClick={this.next}>
                                    <i className="icon-next"></i>
                                </div>
                                <div className="play-list-button" onClick={this.showPlayList}>
                                    <i className="icon-play-list"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="player-bg" ref="playerBg"></div>
                    <audio ref="audio"></audio>
                </div>
                </CSSTransition>
                <MiniPlayer song={song} progress={this.state.playProgress}
                            playOrPause={this.playOrPause}
                            next={this.next}
                            showStatus={this.props.showStatus}
                            showMiniPlayer={this.showPlayer}/>
            </div>
        );
    }
}

function getTime(second){
    second = Math.floor(second);
    let minute = Math.floor(second / 60);
    second = second - minute * 60;
    return minute  + ":" + formatTime(second);
}
function formatTime(time){
    let timeStr = "00";
    if(time > 0 && time < 10){
        timeStr = "0" + time;
    }else if(time >= 10){
        timeStr = time;
    }
    return timeStr;
}

export default Player