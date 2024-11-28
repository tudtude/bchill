interface SyslogConfig {
    timestamp?: boolean;
    enabled?: boolean;
    protocol?: string;
    port?: number;
    host?: string;
    facility?: string;
}

interface LogConfig {
    console?: boolean;
    file?: string;
    syslog?: SyslogConfig;
}

interface RedisConfig {
    host: string;
    port: number;
}

interface MongooseConfig {
    uri: string;
    mongooseOptions: MongooseOptionsConfig;
}

interface MongooseOptionsConfig {
    user: string;
    pass: string;
    authSource: string;
}

export interface ConfigProps {
    apiPort: number;
    appName: string;
    winstonLog?: LogConfig;
    redis?: RedisConfig;
    mongoose?: MongooseConfig;
}
