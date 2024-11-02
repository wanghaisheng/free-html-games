const fs = require('fs');
const path = require('path');
const sharp = require('sharp'); // To handle image processing

// Load the configuration from JSON file
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const searchAndReplace = (dir, search, replace) => {
    fs.readdir(dir, (err, files) => {
        if (err) throw err;

        files.forEach(file => {
            const filePath = path.join(dir, file);
            fs.stat(filePath, (err, stats) => {
                if (err) throw err;

                if (stats.isDirectory()) {
                    searchAndReplace(filePath, search, replace);
                } else if (stats.isFile()) {
                    fs.readFile(filePath, 'utf8', (err, data) => {
                        if (err) throw err;

                        if (data.includes(search)) {
                            const newData = data.replace(new RegExp(search, 'g'), replace);
                            fs.writeFile(filePath, newData, 'utf8', err => {
                                if (err) throw err;
                                console.log(`Replaced '${search}' with '${replace}' in ${filePath}`);
                            });
                        }
                    });
                }
            });
        });
    });
};

const replaceImage = (sourceImagePath, targetImagePath) => {
    fs.copyFile(sourceImagePath, targetImagePath, err => {
        if (err) throw err;
        console.log(`Replaced image at ${targetImagePath}`);
    });
};

// Paths
const directoryPath = 'your_directory'; // Change this to your directory path
const imageSourcePath = 'path_to_your_weixin.jpg'; // Path to your new image
const imageTargetPath = path.join(directoryPath, 'index/img/weixin.jpg');

// Step 1
searchAndReplace(directoryPath, '空中传媒', config.gameName);

// Step 2
searchAndReplace(directoryPath, 'game.ikongzhong.cn', config.gameAccessAddress);

// Step 3
searchAndReplace(directoryPath, 'http://mp.weixin.qq.com/s?__biz=MzI4MjA2MjE0MQ==&mid=246005295&idx=1&sn=490f8141976d607ba079d48f52a3fcd7#rd', config.followLink);

// Step 4
searchAndReplace(directoryPath, 'mkongzhong', config.wechatID);

// Step 5
replaceImage(imageSourcePath, imageTargetPath);
