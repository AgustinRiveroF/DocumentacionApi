import { dirname, join } from "path";
import { fileURLToPath } from "url";
import bcrypt from 'bcrypt'
import crypto from "crypto";

//export const __dirname = dirname(fileURLToPath(import.meta.url)); // Al mismo nivel que src 

export const __dirname = join(dirname(fileURLToPath(import.meta.url)), ".."); //Dentro de src 

export const hashData = async(data) => {
    return bcrypt.hash(data,10);
};

export const compareData = async(data,hashedData) => {
    return bcrypt.compare(data,hashedData)
}


export function generateUniqueToken() {
  const randomBytes = crypto.randomBytes(6);

  const token = randomBytes
    .toString('hex')
    .split('')
    .map(char => String.fromCharCode(parseInt(char, 16) % 10 + 48))
    .join('')
    .slice(0, 6);

  return token;
}




