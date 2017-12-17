/**
 * 歌手类模型
 */
export class Singer {
	constructor(id, mId, name, img) {
		this.id = id;
		this.mId = mId;
		this.name = name;
		this.img = img;
	}
}

/**
 * 通过搜索创建歌手对象函数
 */
export function createSingerBySearch(data) {
	return new Singer(
		data.singerid,
		data.singermid,
		data.singername,
		`http://y.gtimg.cn/music/photo_new/T001R68x68M000${data.singermid}.jpg?max_age=2592000`
	);
}

/**
 * 通过歌手详情创建歌手对象函数
 */
export function createSingerByDetail(data) {
	return new Singer(
		data.singer_id,
		data.singer_mid,
		data.singer_name,
		`http://y.gtimg.cn/music/photo_new/T001R300x300M000${data.singer_mid}.jpg?max_age=2592000`
	);
}