const {RESULT_CODES, RESULT_STATUSES} = require('../../common/constants');
const {Storage} = require('@google-cloud/storage');
const config = require('../../common/config');
const DBManager = require('../../common/db-manager');
const keyFilename = 'gcp-cloud-key.json';
const storage = new Storage({projectId: config.GCP_PROJECT_ID, keyFilename});
const {v4: uuidv4} = require('uuid');

async function getImages(request, response) {
    try {
        const {filter = '', skip = 0, take = 20} = request.query;
        // TODO: Maybe add cache layer
        const gifsList = await DBManager.getManyDocuments(config.DB_NAME, config.MONGO_COLLECTION_KIFFER_IMAGES, {tags: new RegExp(`.*${filter}.*`, 'i')}, Number(skip), Number(take));
        return response.status(200).json({
            resultCode: RESULT_CODES.SUCCESS,
            resultStatus: RESULT_STATUSES.SUCCESS,
            message: 'Successfully retrieved list',
            data: {list: gifsList.sort(() => Math.random() - 0.5)},
        });

    } catch (error) {
        console.error('!!! Error while retrieving images list: ');
        console.error(error);
        return response.status(500).json({
            resultCode: RESULT_CODES.ERROR,
            resultStatus: RESULT_STATUSES.ERROR,
            message: 'Error while retrieving images list',
            data: null,
        });
    }
}

async function addImage(request, response) {
    try {
        const {tags} = request.body;
        const {originalname} = request.file;
        console.info(`### Request to add new gif named - ${originalname}`);
        const newUniqueName = generateUniqueImageName(originalname);
        const downloadURL = await uploadImageToGCS(request.file.buffer, newUniqueName);
        console.info('### Successfully uploaded to GCS. DownloadURL from cloud storage - ', downloadURL);
        const newID = uuidv4();
        await DBManager.insertDocument(config.DB_NAME, config.MONGO_COLLECTION_KIFFER_IMAGES, {
            tags: tags || '',
            downloadURL,
            id: newID,
            name: newUniqueName,
        });
        return response.status(200).json({
            resultCode: RESULT_CODES.SUCCESS,
            resultStatus: RESULT_STATUSES.SUCCESS,
            message: 'Image inserted in mongo successfully',
            data: {downloadURL, id: newID},
        });
    } catch (error) {
        console.error('!!! Error while adding image: ');
        console.error(error);
        return response.status(500).json({
            resultCode: RESULT_CODES.ERROR,
            resultStatus: RESULT_STATUSES.ERROR,
            message: 'Error while adding image',
            data: {error},
        });
    }

    function generateUniqueImageName(originalName) {
        return Date.now() + '_' + originalName;
    }
}

async function getImage(request, response) {
    try {
        const {id} = request.params;
        const gif = await DBManager.getDocument(config.DB_NAME, config.MONGO_COLLECTION_KIFFER_IMAGES, {id});
        return response.json({
            resultCode: RESULT_CODES.SUCCESS,
            resultStatus: RESULT_STATUSES.SUCCESS,
            message: '',
            data: {gif},
        });

    } catch (error) {
        console.error('Error while retrieving gifs: ');
        console.error(error);
        return response.status(500).json({
            resultCode: RESULT_CODES.ERROR,
            resultStatus: RESULT_STATUSES.ERROR,
            message: 'Error while retrieving gifs',
            data: null,
        });
    }
}

async function deleteImage(request, response) {
    const {id} = request.query;
    try {
        const image = await DBManager.getDocument(config.DB_NAME, config.MONGO_COLLECTION_KIFFER_IMAGES, {id});
        if (!image) {
            return response.status(404).json({
                resultCode: RESULT_CODES.ERROR,
                resultStatus: RESULT_STATUSES.ERROR,
                message: `Image with id-${id} not found`,
                data: null,
            });
        }
        await deleteFileFRomGCC(image.name);
        await DBManager.removeDocument(config.DB_NAME, config.MONGO_COLLECTION_KIFFER_IMAGES, {id});
        return response.status(200).json({
            resultCode: RESULT_CODES.SUCCESS,
            resultStatus: RESULT_STATUSES.SUCCESS,
            message: 'Image successfully removed',
            data: null,
        });
    } catch (error) {
        console.error(`!!! Error while removing image with id: ${id}`);
        console.error(error);
        return response.status(500).json({
            resultCode: RESULT_CODES.ERROR,
            resultStatus: RESULT_STATUSES.ERROR,
            message: `Error while removing image with id: ${id}`,
            data: null,
        });
    }
}

function uploadImageToGCS(buffer, originalname) {
    const blob = storage.bucket(config.GCP_STORAGE_BUCKET_NAME).file(originalname);
    const blobStream = blob.createWriteStream();

    return new Promise((resolve, reject) => {
        blobStream.on('error', (err) => {
            console.error('!!! Error uploading file: ');
            console.error('!!! ', err);
            reject('!!! Error uploading file');
        });

        blobStream.on('finish', async () => {
            try {
                // Get a signed URL for the uploaded file
                const [url] = await blob.getSignedUrl({
                    action: 'read',
                    expires: '01-01-2030', // Set an expiration date for the URL as needed
                });
                resolve(url);
            } catch (err) {
                console.error('!!! Error generating signed URL');
                console.error('!!! ', err);
                reject('!!! Error generating signed URL');
            }
        });
        blobStream.end(buffer);
    });
}

async function deleteFileFRomGCC(objectName) {
    const file = storage.bucket(config.GCP_STORAGE_BUCKET_NAME).file(objectName);
    return await file.delete();
}

async function getMockImages(req, res) {
    return res.status(200).json({
        resultCode: RESULT_CODES.SUCCESS,
        resultStatus: RESULT_STATUSES.SUCCESS,
        message: 'successfully retrieved list',
        data: getMockImagesList(),
    });
}

async function getMockImage(req, res) {
    const {id} = req.params;
    return res.status(200).json({
        resultCode: RESULT_CODES.SUCCESS,
        resultStatus: RESULT_STATUSES.SUCCESS,
        message: 'successfully retrieved list',
        data: getMockImageData(id),
    });
}


function getMockImagesList() {
    const imgList = [];
    let id;
    for (id = 500; id < 900; id++) {
        imgList.push({id, src: `https://picsum.photos/id/${id}/200/300`});
    }
    return imgList;
}

function getMockImageData(id) {
    return {id, src: `https://picsum.photos/id/${id}/200/300`};
}

module.exports = {getImages, getImage, addImage, deleteImage, getMockImage, getMockImages};
