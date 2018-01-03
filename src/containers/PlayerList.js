import {connect} from "react-redux"
import {changeSong, removeSong} from "../redux/actions"
import PlayerList from "../components/play/PlayerList"

//映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
    currentSong: state.song,
    playSongs: state.songs
});

//映射dispatch到props上
const mapDispatchToProps = (dispatch) => ({
    changeCurrentSong: (song) => {
        dispatch(changeSong(song));
    },
    removeSong: (id) => {
        dispatch(removeSong(id));
    }
});

//将ui组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(PlayerList)