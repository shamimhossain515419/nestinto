import { registerAs } from '@nestjs/config';
export default registerAs('appConfig', () => ({
  environment: process.env.NODE_ENV || 'production',
  apiVersion: process.env.API_VERSION,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  mailHost: process.env.MAIL_HOST,
  smtpUsername: process.env.SMTP_USERNAME,
  smtpPassword: process.env.SMTP_PASSWORD,
}));
