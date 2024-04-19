const { RESULT_CODES, RESULT_STATUSES } = require('../../common/constants');

async function getImages(req, res) {
	return res.status(200).json({
		resultCode: RESULT_CODES.SUCCESS,
		resultStatus: RESULT_STATUSES.SUCCESS,
		message: 'successfully retrieved words list',
		data: getMockImages()
	});
}

async function getImage(req, res) {
	const { id } = req.params;
	return res.status(200).json({
		resultCode: RESULT_CODES.SUCCESS,
		resultStatus: RESULT_STATUSES.SUCCESS,
		message: 'successfully retrieved words list',
		data: getMockImage(id)
	});
}

function getMockImages() {
	const imgList = [];
	let id;
	for (id = 1; id < 1000; id++) {
		imgList.push(`https://picsum.photos/id/${id}/200/300`);
	}
	return imgList;
}

function getMockImage(id) {
	return `https://picsum.photos/id/${id}/200/300`;
}

module.exports = { getImages, getImage };