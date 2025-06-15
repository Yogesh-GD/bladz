import path from "path"
import fs from "fs"
import multer from "multer"

const isDirExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true })
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file)
    let folder = "public/uploads/others"
    if (file.fieldname === 'avatar') folder = 'public/uploads/avatars';
    else if (file.fieldname === 'groupImage') folder = 'public/uploads/groups';
    else if (file.fieldname === 'file') {
      if (file.fieldname === 'file') {
        const mime = file.mimetype;
        if (mime.startsWith('image')) folder = 'public/uploads/images';
        else if (mime.startsWith('video')) folder = 'public/uploads/videos';
        else if (mime.startsWith('audio')) folder = 'public/uploads/audios';
        else folder = 'public/uploads/files';
      }

    }

    isDirExists(folder)

    cb(null, folder)
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, name);
  }
})


const allowedMimeTypes = {
  avatar: ['image/jpeg', 'image/png', 'image/webp'],
  groupImage: ['image/jpeg', 'image/png', 'image/webp'],
  file: ['image/*', 'video/*', 'audio/*', 'application/pdf', 'application/zip', 'application/msword']
};



const fileFilter = (req, file, cb) => {
  const allowed = allowedMimeTypes[file.fieldname];

  if (!allowed) {
    cb(null, true);
    return;
  }

  const isAllowed = allowed.some((type) => {
    if (type.endsWith('/*')) {
      return file.mimetype.startsWith(type.replace('/*', ''));
    }
    return file.mimetype === type;
  });

  if (isAllowed) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}`), false);
  }
};


const limits = {
  fileSize: 10 * 1024 * 1024
};

export const upload = multer({
  storage,
  fileFilter,
  limits
});



export const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  } else if (err) {

    return res.status(500).json({
      success: false,
      message: 'File upload error',
      error: err.message,
    });
  }


  next();
};