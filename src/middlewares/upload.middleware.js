const multer = require("multer")
const path = require("path")
const acceptedTypes = ["image/png", "image/jpeg", "image/webp", "image/jpg"]



const upload = multer({
    storage: multer.diskStorage({
        destination: path.join(__dirname, "../../public/images"),
        filename:(req, file, callback) => {
            const date = Date.now();
            callback(null, `${date}-${file.originalname}`)
        }
    }),
    limits:{
        fileSize: 500000
    },
    fileFilter: (req, file, callback) => {
        // console.log(file)
        const { mimetype } = file;
        if (!acceptedTypes.includes(mimetype)) {
            return callback({
                status: 400,
                errorName : 'file not allowed',
                error : `only ${acceptedTypes}`
            })
            
        }
        callback(null, true)
        
    }
});

module.exports = upload;