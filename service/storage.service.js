import ImageKit from "imagekit";
import dotenv from "dotenv"
dotenv.config()

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATY_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function fileUpload(file, fileName) {
  const  result = await imagekit.upload({
    file: file, //required
    fileName: fileName, //required
  });
  return result;
}

export default fileUpload;
