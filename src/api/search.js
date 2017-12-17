import jsonp from "./jsonp"
import {URL, PARAM, OPTION} from "./config"

export function getHotKey() {
	const data = Object.assign({}, PARAM, {
		g_tk: 5381,
		uin: 0,
		platform: "h5",
		needNewCode: 1,
		notice: 0,
		_: new Date().getTime()
	});

	return jsonp(URL.hotkey, data, OPTION);
}

export function search(w) {
	const data = Object.assign({}, PARAM, {
		g_tk: 5381,
		uin: 0,
		platform: "h5",
		needNewCode: 1,
		notice: 0,
		zhidaqu: 1,
		catZhida: 1,
		t: 0,
		flag: 1,
		ie: "utf-8",
		sem: 1,
		aggr: 0,
		perpage: 20,
		n: 20,
		p: 1,
		w,
		remoteplace: "txt.mqq.all",
		_: new Date().getTime()
	});

	return jsonp(URL.search, data, OPTION);
}