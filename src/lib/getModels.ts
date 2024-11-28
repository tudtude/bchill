const mongoose = require("mongoose");

module.exports = async (service: any) => {
    const { config, logger } = service;
    mongoose.connection.on("connected", () => {
        if (logger) {
            logger.info("Mongoose connected to " + config.mongoose.uri);
        } else {
            console.log("Mongoose connected to " + config.mongoose.uri);
        }
    });

    mongoose.connection.on("error", (error: any) => {
        if (logger) {
            logger.error("Mongoose connected error " + config.mongoose.uri);
            logger.error(new Error(error));
        } else {
            console.log("Mongoose connected error " + config.mongoose.uri);
            console.log(new Error(error));
        }
    });

    await mongoose.connect(
        config.mongoose.uri,
        config.mongoose.mongooseOptions
    );

    let models: any = {};
    const processDir = ({ dir, dirTarget, name }: any) => {
        models[`${name}`] = require(`${dirTarget}/${dir}/models/${name}`)(
            mongoose
        );
    };

    try {
        require("./getModules")({ type: "models", processDir, service });
        return models;
    } catch (error: any) {
        logger.error("there is error while loading models");
        logger.error(new Error(error));
    }
};
