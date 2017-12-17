import jsonp from "./jsonp"
import {URL, PARAM, OPTION} from "./config"

export function getSingerInfo(mId) {
	const data = Object.assign({}, PARAM, {
		g_tk: 5381,
		loginUin: 0,
		hostUin: 0,
		platform: "yqq",
		needNewCode: 0,
		singermid: mId,
		order: "listen",
		begin: 0,
		num: 100,
		songstatus: 1
	});
	return jsonp(URL.singerInfo, data, OPTION);
}