/**
 * B"H
 * Generate DKIM key pairs for email usage
 */

const { generateKeyPairSync } = require('crypto');

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

console.log('Private Key:', privateKey.export({
  type: 'pkcs1',
  format: 'pem',
}));
console.log('Public Key:', publicKey.export({
  type: 'pkcs1',
  format: 'pem',
}));
