const express = require('express');
const router = express.Router();
const path = require('path');
const STORY_SEEN = require('../models/storySeen')
const UserImage = require('../models/userImage')
const { Op } = require('sequelize');
// const {}

//============================
//Files Controller
//============================

router.get('/audio/:fileName', async (req, res) => {
    var fs = require('fs');
    // var appDir = path.dirname(require.main.filename);
    const filePath = path.join(__dirname, '../public/', 'audio', req.params.fileName);
    fs.readFile(filePath, function (err, data) {
        if (err) return res.status(400).send({})
        else {
            res.writeHead(200, { 'Content-Type': 'audio/wav' });
            return res.end(data);
        }
    });
});

router.get('/video/:fileName', async (req, res) => {
    const id = req.params.fileName;
    const filepath = path.join(__dirname, '../assets', 'images', req.params.fileName);
    // Check if the file exists
    if (!fs.existsSync(filepath)) {
        res.status(404).send('File not found');
        return;
    }
    // Set headers for the download response
    const fileSize = fs.statSync(filepath).size;
    // Handle range requests for resuming downloads
    const range = req.headers.range;
    const fileExtension = path.extname(filepath).toLowerCase();
    var contentType = 'application/octet-stream'
    if (fileExtension === '.mp4') {
        contentType = 'video/mp4';
    } else if (fileExtension === '.mov' || fileExtension === '.quicktime') {
        contentType = 'video/quicktime';
    } else if (fileExtension === '.jpg' || fileExtension === '.jpeg' || fileExtension === '.png') {
        contentType = 'image/jpeg';
    }
    res.set({
        'Content-Type': contentType,
        'Content-Length': fileSize,
        'Content-Disposition': `attachment; id="${id}"`,
        'Cache-Control': 'public, max-age=31536000',
        'Accept-Ranges': 'bytes'
    });
    console.log(res);
    if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        console.log("Downloading file in part");
        console.log('start: ', start);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        console.log('end: ', end);
        const chunksize = (end - start) + 1;
        res.writeHead(206, {
            'Content-Type': 'application/octet-stream',
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Content-Length': chunksize,
            'Accept-Ranges': 'bytes'
        });
        const file = fs.createReadStream(filepath, { start, end });
        let downloadedBytes = 0;
        file.on('data', function (chunk) {
            downloadedBytes += chunk.length;
            res.write(chunk);
        });
        file.on('end', function () {
            console.log('Download completed');
            res.end();
        });
        file.on('error', function (err) {
            console.log('Error while downloading file:', err);
            res.status(500).send('Error while downloading file');
        });
    } else {
        // Handle full file download requests
        console.log("Downloading Entire file");
        const file = fs.createReadStream(filepath);
        file.pipe(res);
    }
});


// router.get('/', async (req, res) => {
//     var fs = require('fs');
//     const filePath = path.join(__dirname, '../assets', 'images', req.query.fileName);

//     fs.readFile(filePath, function (err, data) {
//         if (err) {
//             return res.status(400).send({});
//         } else {
//             // Determine the content type based on the file extension
//             const fileExtension = path.extname(filePath).toLowerCase();
//             let contentType = 'application/octet-stream'; // default to binary stream

//             if (fileExtension === '.mp4') {
//                 contentType = 'video/mp4';
//             } else if (fileExtension === '.mov' /*|| fileExtension === '.quicktime'*/) {
//                 contentType = 'video/quicktime';
//             } else if (fileExtension === '.jpg' || fileExtension === '.jpeg' || fileExtension === '.png') {
//                 contentType = 'image/jpeg';
//             }
//             res.setHeader('Content-Type', contentType);
//            // res.writeHead(200, { 'Content-Type': contentType });
//             return res.end(data);
//         }
//     });
// });


const fs = require('fs');

//const path = require('path');
//const express = require('express');
//const router = express.Router();

/*router.get('/:fileName', async (req, res) => {

    const filePath = path.join(__dirname, '../assets', 'images', req.params.fileName);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found');
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    // Determine the content type based on the file extension
    const fileExtension = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream'; // default to binary stream

    if (fileExtension === '.mp4') {
        contentType = 'video/mp4';
    } else if (fileExtension === '.mov' || fileExtension === '.quicktime') {
        contentType = 'video/quicktime';
    } else if (fileExtension === '.jpg' || fileExtension === '.jpeg' || fileExtension === '.png') {
        contentType = 'image/jpeg';
    }

    // console.log(req.headers,'req.headers')
    let userId = parseInt(req.headers?.userid) || parseInt(req.headers?.userId)
    let endsWithUrlForFile = req.url   ///files/image-1715158709312.mp4
    console.log(req.url, userId)

    if (userId) {
        // console.log('enter in story')
        const findStory = await UserImage.findOne({
            where: {
                file: {
                    [Op.like]: `%${endsWithUrlForFile}`
                },
                type: 'story'
            }
        });

        console.log(JSON.parse(JSON.stringify(findStory)), 'findStory')

        if (findStory) {
            // console.log(typeof findStory.userId, typeof userId, userId, findStory.userId)
            const isViewer = await STORY_SEEN.findOne({
                where: {
                    storyId: findStory?.id,
                    viewerId: userId
                }
            })
            if (!isViewer) {
                await STORY_SEEN.create({
                    storyId: findStory.id,
                    viewerId: userId
                })
                console.log('crete new seen')
            }
        }
    }

    // Set headers to let the browser know it's a video stream
    res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': fileSize,
        'Accept-Ranges': 'bytes',
    });

    const videoStream = fs.createReadStream(filePath);
    videoStream.pipe(res);
});*/

// router.get('/', (req, res) => {
//     const filePath = path.join(__dirname, '../assets', 'images', req.query.fileName);
//     const stat = fs.statSync(filePath);
//     const fileSize = stat.size;

//     // Determine the content type based on the file extension
//     const fileExtension = path.extname(filePath).toLowerCase();
//     let contentType = 'application/octet-stream'; // default to binary stream

//     if (fileExtension === '.mp4') {
//         contentType = 'video/mp4';
//     } else if (fileExtension === '.mov' /*|| fileExtension === '.quicktime'*/) {
//         contentType = 'video/quicktime';
//     } else if (fileExtension === '.jpg' || fileExtension === '.jpeg' || fileExtension === '.png') {
//         contentType = 'image/jpeg';
//     }else if (fileExtension === '.mp3') {
//         contentType = 'audio/mpeg';
//     } else if (fileExtension === '.wav') {
//         contentType = 'audio/wav';
//     } 

//     // Set headers to let the browser know it's a video stream
//     res.writeHead(200, {
//         'Content-Type': contentType,
//         'Content-Length': fileSize,
//         'Accept-Ranges': 'bytes',
//     });

//     const videoStream = fs.createReadStream(filePath);
//     videoStream.pipe(res);
// });



module.exports = router;

