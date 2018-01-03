import React from "react"
import Player from "@/containers/Player"
import PlayerList from "@/containers/PlayerList"


class MusicPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSongIndex: 0,
            show: false,  //控制播放列表显示和隐藏
        }
    }
    changeCurrentIndex = (index) => {
        this.setState({
            currentSongIndex: index
        });
    }
    showList = (status) => {
        this.setState({
            show: status
        });
    }
    render() {
        return (
            <div className="music-player">
                <Player currentIndex={this.state.currentSongIndex}
                        showList={this.showList}
                        changeCurrentIndex={this.changeCurrentIndex}/>
                <PlayerList currentIndex={this.state.currentSongIndex}
                            showList={this.showList}
                            changeCurrentIndex={this.changeCurrentIndex}
                            show={this.state.show}/>
            </div>
        );
    }
}

export default MusicPlayer;