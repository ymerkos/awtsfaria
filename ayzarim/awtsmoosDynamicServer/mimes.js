/**B"H
 * 
 * different mime types
 */

 var mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    ".json": "application/json",
    '.jsm': 'application/javascript',
    '.mjs': 'application/javascript',
    '.glb':'model/gltf-binary',
    '.gltf':'model/gltf-binary',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.tiff': 'image/tiff',
    '.bmp': 'image/bmp',
    '.raw': 'image/x-dcraw',
    '.heif': 'image/heif',
    '.heif-sequence': 'image/heif-sequence',
    '.heic': 'image/heic',
    '.heic-sequence': 'image/heic-sequence',
    '.avif': 'image/avif',
    '.jxl': 'image/jxl',
    '.bat': 'image/x-ms-bmp',
    '.dib': 'image/bmp',
    '.jfif': 'image/jpeg',
    '.pjpeg': 'image/jpeg',
    '.pjp': 'image/jpeg',
    '.webp': 'image/webp',
    '.apng': 'image/apng',
    '.flif': 'image/flif',
    '.hdr': 'image/vnd.radiance',
    '.cur': 'image/x-icon',
    '.ani': 'application/x-navi-animation',
 };
 var binaryMimeTypes = [
    'model/gltf-binary',
    'image/png',
    'image/jpeg',
    'image/svg+xml',
    'image/gif',
    'image/webp',
    'image/x-icon',
    'image/tiff',
    'image/bmp',
    'image/x-dcraw',
    'image/heif',
    'image/heif-sequence',
    'image/heic',
    'image/heic-sequence',
    'image/avif',
    'image/jxl',
    'image/x-ms-bmp',
    'image/bmp',
    'image/jpeg',
    'image/jpeg',
    'image/jpeg',
    'image/webp',
    'image/apng',
    'image/flif',
    'image/vnd.radiance',
    'image/x-icon',
    'application/x-navi-animation',
    'application/octet-stream'
  ];

  module.exports = {
    binaryMimeTypes,
    mimeTypes
  }