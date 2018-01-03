import React from "react"
import ReactDOM from "react-dom"
import { CSSTransition } from "react-transition-group"
import Scroll from "@/common/scroll/Scroll"

import "./playerlist.styl"

class PlayerList extends React.Component {
    constructor(props) {
        super(props);

        this.changeIndex = {
            shouldChange: false,
            index: 0
        };

        this.state = {
            showList: false
        };
    }
    componentDidUpdate() {
        //重置当前歌曲位置
        if (this.changeIndex.shouldChange === true) {
            this.props.changeCurrentIndex(this.changeIndex.index);
            this.changeIndex.shouldChange = false;
        }
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
    /**
     * 滚动到当前播放歌曲
     */
    scrollToCurrentItem() {
        this.refs.scroll.bScroll.scrollToElement(
            ReactDOM.findDOMNode(this.refs[`item${this.props.currentIndex}`])
        );
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
                                   this.scrollToCurrentItem();
                               }}
                               onExited={() => {
                                   this.setState({showList:false});
                                   this.scrollToCurrentItem();
                               }}>
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
                                            let isCurrent = false;
                                            if (song.id === this.props.currentSong.id) {
                                                isCurrent = true;
                                                //设置当前播放歌曲位置，并提示父组件更新当前歌曲位置
                                                this.changeIndex = {
                                                    shouldChange: true,
                                                    index
                                                };
                                            }
                                            return (
                                                <div className="play-list-item" key={song.id} ref={`item${index}`}>
                                                    <div className="item-left">{index + 1 < 10 ? `0${index + 1}` : index + 1}</div>
                                                    <div className="item-right">
                                                        <div className={isCurrent ? "song current" : "song"} onClick={this.playSong(song, index)}>
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