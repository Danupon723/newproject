
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const MAX_MB = Number(process.env.UPLOAD_MAX_MB || 10);
const MAX_BYTES = MAX_MB * 1024 * 1024;

// อนุญาต mimetype ทั่วไป (แนะนำ: map ตาม evidence_type ในชั้น controller เพิ่มเติม)
const ALLOWED = new Set([
  'image/png',
  'image/jpeg',
  'application/pdf'
]);

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // ใช้ period_id + evaluatee_id (จาก JWT หรือ body สำหรับ admin)
    console.log('__dirname', __dirname);
    const base = path.join(__dirname, '..', 'uploads');
    const period = String(req.body.period_id || 'misc');
    const evaluatee = String((req.user && req.user.name) || req.body.evaluatee_id || 'unknown');
    const dest = path.join(base, period, evaluatee);
    ensureDir(dest);
    console.log('Upload destination:', dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safe = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9._-]/g, '_');
    const name = `${Date.now()}_${safe}${ext}`;
    cb(null, name);
  }
});

function fileFilter(req, file, cb) {
  if (!ALLOWED.has(file.mimetype)) {
    return cb(new Error('Unsupported file type'), false);
  }
  cb(null, true);
}


const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_BYTES } });
module.exports = upload;   // ← export อินสแตนซ์ตรง ๆ

// function single(field) {
//   return multer({ storage, fileFilter, limits: { fileSize: MAX_BYTES } }).single(field);
// }
// module.exports = { single };
