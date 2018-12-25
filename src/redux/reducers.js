import { combineReducers } from "redux"
import * as ActionTypes from "./actionTypes"
import localStorage from "../util/storage"

/**
 * reducer就是一个纯函数，接收旧的state和action，返回新的state
 */

// 需要存储的初始状态数据
const initialState = {
  skin: localStorage.getSkin(),  // 皮肤
  showStatus: false,  // 显示状态
  song: localStorage.getCurrentSong(),  // 当前歌曲
  songs: localStorage.getSongs()  // 歌曲列表
};

// 拆分Reducer

// 设置皮肤
function skin(skin = initialState.skin, action) {
  switch (action.type) {
    case ActionTypes.SET_SKIN:
      return action.skin;
    default:
      return skin;
  }
}

// 显示或隐藏播放状态
function showStatus(showStatus = initialState.showStatus, action) {
  switch (action.type) {
    case ActionTypes.SHOW_PLAYER:
      return action.showStatus;
    default:
      return showStatus;
  }
}

// 修改当前歌曲
function song(song = initialState.song, action) {
  switch (action.type) {
    case ActionTypes.CHANGE_SONG:
      return action.song;
    default:
      return song;
  }
}

// 添加或移除歌曲
function songs(songs = initialState.songs, action) {
  switch (action.type) {
    case ActionTypes.SET_SONGS:
      return action.songs;
    case ActionTypes.REMOVE_SONG_FROM_LIST:
      let newSongs = songs.filter(song => song.id !== action.id);
      return newSongs;
    default:
      return songs;
  }
}


// 合并Reducer
const reducer = combineReducers({
  skin,
  showStatus,
  song,
  songs
});

export default reducer
