import multer, { Multer } from "multer";

// TODO: Find a more elegant implementation for this.
export const upload: Multer = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 4000000 //4mb
    },
    fileFilter: function(_, file, callback) {
        if (file.mimetype !== "application/pdf") {
            callback(null, false);
        } else {
            callback(null, true);
        }
    }
});
