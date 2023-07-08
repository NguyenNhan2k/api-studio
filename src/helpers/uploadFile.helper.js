const multer = require('multer');
function uploadFile(path) {
    try {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, `E:/WorkSpaces/Studio/src/public/images/${path}`);
            },
            filename: function (req, file, cb) {
                const arrFileName = file.originalname.split('.');
                const newFileName = `${arrFileName[0]}-${Date.now()}.${arrFileName[1]}`;
                cb(null, newFileName);
            },
        });
        return multer({ storage: storage });
    } catch (error) {
        console.log(error);
        return false;
    }
}
module.exports = uploadFile;
