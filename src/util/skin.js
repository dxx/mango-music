import localStorage from "./storage"

const skin = {};

skin.mangoYellow = {
  appColor: "#333333",
  appBgColor: "#F8F8FF",
  /* 首页header */
  appHeaderColor: "#FFFFF0",
  appHeaderBgColor: "#FFA500",
  /* 首页tab */
  tabColor: "rgba(0, 0, 0, .7)",
  tabBgColor: "#FFFFFF",
  /* 最新专辑 */
  albumColor: "rgba(0, 0, 0, 0.6)",
  albumNameColor: "#333333",
  /* 排行榜 */
  rankingWrapperBgColor: "#FFFFFF",
  rankingSingerColor: "rgba(0, 0, 0, 0.5)",
  /* 搜索 */
  searchBgColor: "#FFFFFF",
  searchBoxBgColor: "#FFFFFF",
  searchBoxWrapperBgColor: "#F8F8FF",
  searchTitleColor: "rgba(0, 0, 0, .7)",
  searchHotColor: "#000000",
  searchHotBorderColor: "rgba(0, 0, 0, .7)",
  searchResultBorderColor: "#E5E5E5",
  /* 详情 */
  detailBgColor: "#F8F8FF",
  detailSongColor: "#000000",
  detailSingerColor: "rgba(0, 0, 0, 0.6)",
  /* mini播放器 */
  miniPlayerBgColor: "#FFFFFF",
  miniImgBorderColor: "#EEEEEE",
  miniProgressBarBgColor: "rgba(0, 0, 0, 0.1)",
  miniRightColor: "#FFD700",
  miniSongColor: "#333333",
  activeColor: "#FFA500"
};

skin.coolBlack = {
  appColor: "#DDDDDD",
  appBgColor: "#212121",
  appHeaderColor: "#FFD700",
  appHeaderBgColor: "transparent",
  tabColor: "#DDDDDD",
  tabBgColor: "transparent",
  albumColor: "rgba(221, 221, 221, 0.7)",
  albumNameColor: "#FFFFFF",
  rankingWrapperBgColor: "#333333",
  rankingSingerColor: "rgba(221, 221, 221, 0.7)",
  searchBgColor: "#212121",
  searchBoxBgColor: "#333333",
  searchBoxWrapperBgColor: "#212121",
  searchTitleColor: "#FFD700",
  searchHotColor: "#DDDDDD",
  searchHotBorderColor: "transparent",
  searchResultBorderColor: "transparent",
  detailBgColor: "#212121",
  detailSongColor: "#FFFFFF",
  detailSingerColor: "rgba(221, 221, 221, 0.7)",
  miniPlayerBgColor: "#333333",
  miniImgBorderColor: "rgba(221, 221, 221, 0.3)",
  miniProgressBarBgColor: "rgba(0, 0, 0, 0.3)",
  miniRightColor: "#FFD700",
  miniSongColor: "#FFFFFF",
  activeColor: "#FFD700"
};

skin.kuGouBlue = Object.assign({}, skin.mangoYellow, {
  appHeaderBgColor: "#2CA2F9",
  activeColor: "#2CA2F9",
  searchTitleColor: "#2CA2F9",
  miniRightColor: "#2CA2F9"
});

skin.netBaseRed = Object.assign({}, skin.mangoYellow, {
  appHeaderBgColor: "#D43C33",
  activeColor: "#D43C33",
  searchTitleColor: "#D43C33",
  miniRightColor: "#D43C33"
});

skin.qqGreen = Object.assign({}, skin.mangoYellow, {
  appHeaderBgColor: "#31C27C",
  activeColor: "#31C27C",
  searchTitleColor: "#31C27C",
  miniRightColor: "#31C27C"
});

let getSkinStyle = (skin) => {
  if (!skin) {
    return "";
  }
  return `
    .skin-app {
      color: ${skin.appColor};
      background-color: ${skin.appBgColor};
    }
    .skin-app-header {
      color: ${skin.appHeaderColor};
      background-color: ${skin.appHeaderBgColor};
    }
    .skin-music-tab {
      color: ${skin.tabColor};
      background-color: ${skin.tabBgColor};
    }
    .skin-recommend-title {
      color: ${skin.activeColor};
    }
    .skin-album-wrapper {
      color: ${skin.albumColor};
    }
    .skin-album-wrapper .album-name {
      color: ${skin.albumNameColor}
    }
    .skin-ranking-wrapper {
      background-color: ${skin.rankingWrapperBgColor};
    }
    .skin-ranking-wrapper .ranking-title {
      color: ${skin.albumNameColor};
    }
    .skin-ranking-wrapper .singer {
      color: ${skin.rankingSingerColor};
    }
    .skin-music-singers .choose {
      color: ${skin.activeColor} !important;
      border: 1px solid ${skin.activeColor} !important;
    }
    .skin-search {
      background-color: ${skin.searchBgColor};
    }
    .skin-search .title {
      color: ${skin.searchTitleColor};
    }
    .skin-search .hot-item {
      border: 1px solid ${skin.searchHotBorderColor};
      color: ${skin.searchHotColor};
      background-color: ${skin.searchBoxBgColor};
    }
    .skin-search-box {
      background-color: ${skin.searchBoxBgColor};
    }
    .skin-search-box input {
      color: ${skin.appColor};
    }
    .skin-search-box-wrapper {
      background-color: ${skin.searchBoxWrapperBgColor};
    }
    .skin-search-result .singer {
      color: ${skin.albumColor};
    }
    .skin-search-result .singer-wrapper .singer {
      color: ${skin.appColor};
    }
    .skin-search-result .singer-wrapper .info {
      color: ${skin.albumColor};
    }
    .skin-detail-wrapper {
      background-color: ${skin.detailBgColor};
    }
    .skin-detail-wrapper .song-name {
      color: ${skin.detailSongColor};
    }
    .skin-detail-wrapper .song-singer {
      color: ${skin.detailSingerColor};
    }
    .skin-mini-player {
      background-color: ${skin.miniPlayerBgColor};
    }
    .skin-mini-player .player-img {
      border: 2px solid ${skin.miniImgBorderColor};
    }
    .skin-mini-player .progress-bar {
      background-color: ${skin.miniProgressBarBgColor} !important;
    }
    .skin-mini-player .progress {
      background-color: ${skin.miniRightColor} !important;
    }
    .skin-mini-player .player-right {
      color: ${skin.miniRightColor};
    }
    .skin-mini-player .song {
      color: ${skin.miniSongColor};
    }
    .skin-mini-player .singer {
      color: ${skin.detailSingerColor};
    }
    .music-album, .ranking-info, .music-singer {
      background-color: ${skin.detailBgColor};
    }
    .nav-link.active {
      color: ${skin.activeColor} !important;
      border-bottom: 2px solid ${skin.activeColor};
    }
  `;
};

let setSkinStyle = (skin) => {
  let styleText = getSkinStyle(skin);
  let oldStyle = document.getElementById("skin");
  const style = document.createElement("style");
  style.id = "skin";
  style.type = "text/css";
  style.innerHTML = styleText;
  oldStyle ? document.head.replaceChild(style, oldStyle) : document.head.appendChild(style);
};

// 设置皮肤
setSkinStyle(skin[localStorage.getSkin()]);

export {skin, setSkinStyle}
