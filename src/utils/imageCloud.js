import {v2 as cloudinary} from 'cloudinary';

import {config} from 'dotenv';
import { env } from './env.js';
import { BD_VARS, CLOUDINARY_VARS } from '../constants/constans.js';

config()

cloudinary.config({
    cloud_name: env(CLOUDINARY_VARS.CLOUDINARY_CLOUD_NAME),
    api_key: env(CLOUDINARY_VARS.CLOUDINARY_API_KEY),
    api_secret: env(CLOUDINARY_VARS.CLOUDINARY_API_SECRET),
});
export default cloudinary;