const { createClient } = require("redis");

module.exports = async ({ config, logger }: any) => {
    const redis = createClient({
        host: config.redis.host,
        port: config.redis.port,
        socket: { host: config.redis.host, port: config.redis.port },
    });
    redis.on("error", (err: any) => {
        if (logger) {
            logger.error(`Redis connection error`);
            logger.error(new Error(err));
        } else {
            console.error(`Redis connection error`);
            console.error(new Error(err));
        }
    });
    await redis.connect();
    return redis;
};
