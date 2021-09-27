import Bull from 'bull';

type Configuration = {
  redis: Bull.QueueOptions['redis'];
  aws: {
    accessKeyId: string;
    secretAccessKey: string;
    s3: {
      bucketName: string;
      region: string;
    };
    cloudfront: {
      uri: string;
    };
  };
};

export default function (): Configuration {
  return {
    redis: process.env.REDIS_URL
      ? process.env.REDIS_URL
      : { host: 'localhost', port: 6379 },
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      s3: {
        bucketName: process.env.AWS_S3_BUCKET_NAME,
        region: process.env.AWS_S3_REGION,
      },
      cloudfront: {
        uri: process.env.AWS_CLOUDFRONT_URI,
      },
    },
  };
}
