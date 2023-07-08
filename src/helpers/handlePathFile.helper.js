const fs = require('fs-extra');
const removeAvatarInFolder = async (avatar, path) => {
    const pathAvatar = `${path}/${avatar}`;
    fs.remove(pathAvatar);
};
const removeArrImgInFolder = (arrImg, path) => {
    arrImg.forEach((img) => {
        const pathIg = `${path}/${img.name}`;
        fs.remove(pathIg);
    });
};
const removeArrImgInFolderNew = (arrImg, path) => {
    arrImg.forEach((img) => {
        const pathIg = `${path}/${img}`;
        fs.remove(pathIg);
    });
};
const removeAvatar = async (path) => {
    const pathAvatar = `${path}`;
    fs.remove(pathAvatar);
};
const removeArrImgForController = (arrImg) => {
    arrImg.forEach((img) => {
        const pathIg = `${img.path}`;
        fs.remove(pathIg);
    });
};
module.exports = {
    removeAvatarInFolder,
    removeArrImgInFolder,
    removeArrImgForController,
    removeAvatar,
    removeArrImgInFolderNew,
};
