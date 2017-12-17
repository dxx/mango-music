import jsonp from "./jsonp"
import {URL, PARAM, OPTION} from "./config"

export function getCarousel() {
	const data = Object.assign({}, PARAM, {
		g_tk: 701075963,
		uin: 0,
		platform: "h5",
		needNewCode: 1,
		_: new Date().getTime()
	});
	return jsonp(URL.carousel, data, OPTION);
}

export function getNewAlbum() {
	const data = Object.assign({}, PARAM, {
		g_tk: 1278911659,
		hostUin: 0,
		platform: "yqq",
		needNewCode: 0,
		cmd: "firstpage",
		page: 0,
		pagesize: 50,
		sort: 1,
		language: -1,
		genre: 0,
		year: 1,
		pay: 0,
		type: -1,
		company: -1
	});
	return jsonp(URL.newalbum, data, OPTION);
}

export function getAlbumInfo(albumMid) {
	const data = Object.assign({}, PARAM, {
		albummid: albumMid,
		g_tk: 1278911659,
		hostUin: 0,
		platform: "yqq",
		needNewCode: 0
	});
	return jsonp(URL.albumInfo, data, OPTION);
}