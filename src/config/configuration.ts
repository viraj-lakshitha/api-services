export interface AppConfig {
  port: number;
  nodeEnv: string;
}

export interface AuthConfig {
  apiKeyAuth: string;
}

export interface EmailConfig {
  resendApiKey: string;
  senderEmail: string;
  senderName: string;
}

export interface DatabaseConfig {
  mongodbUri: string;
}

export interface Config {
  app: AppConfig;
  auth: AuthConfig;
  email: EmailConfig;
  database: DatabaseConfig;
}

export default (): Config => {
  const port = parseInt(process.env.PORT ?? '3000', 10);
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const apiKeyAuth = process.env.APP_API_KEY_AUTH ?? '';
  const resendApiKey = process.env.RESEND_API_KEY ?? '';
  const senderEmail = process.env.SENDER_EMAIL ?? '';
  const senderName = process.env.SENDER_NAME ?? '';
  const mongodbUri =
    process.env.MONGODB_URI ?? 'mongodb://localhost:27017/api-services';

  return {
    app: {
      port,
      nodeEnv,
    },
    auth: {
      apiKeyAuth,
    },
    email: {
      resendApiKey,
      senderEmail,
      senderName,
    },
    database: {
      mongodbUri,
    },
  };
};
