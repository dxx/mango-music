/**
 *  专辑类模型
 */
export class Album {
	constructor(id, mId, name, img, singer, publicTime) {
		this.id = id;
		this.mId = mId;
		this.name = name;
		this.img = img;
		this.singer = singer;
		this.publicTime = publicTime;
	}
}

/**
 *  通过专辑列表数据创建专辑对象函数
 */
export function createAlbumByList(data) {
	return new Album(
		data.album_id,
		data.album_mid,
		data.album_name,
		`http://y.gtimg.cn/music/photo_new/T002R300x300M000${data.album_mid}.jpg?max_age=2592000`,
		filterSinger(data.singers),
		data.public_time
	);
}

/**
 *  通过专辑详情数据创建专辑对象函数
 */
export function createAlbumByDetail(data) {
	return new Album(
		data.id,
		data.mid,
		data.name,
		`http://y.gtimg.cn/music/photo_new/T002R300x300M000${data.mid}.jpg?max_age=2592000`,
		data.singername,
		data.aDate
	);
}

/**
 * 通过搜索创建专辑对象函数
 */
export function createAlbumBySearch(data) {
	return new Album(
		data.albumid,
		data.albummid,
		data.albumname,
		`http://y.gtimg.cn/music/photo_new/T002R68x68M000${data.albummid}.jpg?max_age=2592000`,
		data.singername,
		""
	);
}

function filterSinger(singers) {
	let singerArray = singers.map(singer => {
		return singer.singer_name;
	});
	return singerArray.join("/");
}