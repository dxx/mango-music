import {getCarousel, getNewAlbum, getAlbumInfo} from "./api/recommend";
import {getRankingList, getRankingInfo} from "./api/ranking";
import {getSongVKey} from "./api/song";
import {getHotKey, search} from "./api/search"
import {getSingerList, getSingerInfo} from "./api/singer"

getCarousel().then((res) => {
	console.log("获取轮播：");
	if (res) {
		console.log(res);
	}
});

getNewAlbum().then((res) => {
	console.log("获取最新专辑：");
	if (res) {
		console.log(res);
	}
});

getAlbumInfo("0007kqbv3ZbOtl").then((res) => {
	console.log("获取专辑详情：");
	if (res) {
		console.log(res);
	}
});

getRankingList().then((res) => {
	console.log("获取排行榜：");
	if (res) {
		console.log(res);
	}
});

getRankingInfo(4).then((res) => {
	console.log("获取排行榜详情：");
	if (res) {
		console.log(res);
	}
});

getSongVKey("000OFXjz0Nljbh").then((res) => {
	console.log("获取歌曲vkey：");
	if (res) {
		console.log(res);
	}
});

getHotKey().then((res) => {
	console.log("获取热搜：");
	if (res) {
		console.log(res);
	}
});

search("欧阳朵").then((res) => {
	console.log("搜索：");
	if (res) {
		console.log(res);
	}
});

getSingerList(1, "all_all_all").then((res) => {
	console.log("获取歌手列表：");
	if (res) {
		console.log(res);
	}
});

getSingerInfo("001iI8LW0ZRpXn").then((res) => {
	console.log("获取歌手详情：");
	if (res) {
		console.log(res);
	}
});