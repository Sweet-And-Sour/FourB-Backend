import { randomFillSync } from 'crypto';

const generatePassword = (
  length = 20,
  wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
) => 
  Array.from(randomFillSync(new Uint32Array(length)))
    .map((x) => wishlist[x % wishlist.length])
    .join('');

export const jwtConstants = {
  secret: generatePassword(512),
};
