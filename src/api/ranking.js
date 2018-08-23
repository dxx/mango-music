import jsonp from "./jsonp"
import { URL, PARAM, OPTION } from "./config"

export function getRankingList() {
  const data = Object.assign({}, PARAM, {
    g_tk: 5381,
    uin: 0,
    platform: "h5",
    needNewCode: 1,
    _: new Date().getTime()
  });
  return jsonp(URL.rankingList, data, OPTION);
}

export function getRankingInfo(topId) {
  const data = Object.assign({}, PARAM, {
    g_tk: 5381,
    uin: 0,
    platform: "h5",
    needNewCode: 1,
    tpl: 3,
    page: "detail",
    type: "top",
    topid: topId,
    _: new Date().getTime()
  });
  return jsonp(URL.rankingInfo, data, OPTION);
}