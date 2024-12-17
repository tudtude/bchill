import { Elysia } from "elysia";
import { default as corsjs } from "@elysiajs/cors";

const fs = require("fs");
const path = require("path");

export async function bchill({
    apiPort,
    appName,
    cors,
    winstonLog,
    redis,
    mongoose,
}: {
    apiPort: number;
    appName: string;
    cors?: [string];
    winstonLog?: {
        console?: boolean;
        file?: string;
        syslog?: {
            timestamp?: boolean;
            enabled?: boolean;
            protocol?: string;
            port?: number;
            host?: string;
            facility?: string;
        };
    };
    redis?: {
        host: string;
        port: number;
    };
    mongoose?: {
        uri: string;
        mongooseOptions?: {
            user?: string;
            pass?: string;
            authSource?: string;
        };
    };
}) {
    const elysia = new Elysia();

    let service: any = {};
    service.Elysia = Elysia;
    service.config = { apiPort, appName, winstonLog, redis, mongoose };

    if (winstonLog) {
        const logger = require("./lib/setLog")(service);
        service.logger = logger;
        logger.info("Wintons logger was set");
    }

    if (redis) {
        const redis = await require("./lib/setRedis")(service);
        service.redis = redis;
        service.logger
            ? service.logger.info("Redis was set")
            : console.log("Redis was set");
    }

    if (fs.readdirSync(process.cwd()).includes("modules")) {
        if (mongoose) {
            const models = await require("./lib/getModels")(service);
            service.models = models;
            service.logger
                ? service.logger.info("Mongoose models were set")
                : console.log("Mongoose models were set");
        }

        const methods = require("./lib/getMethods")(service);
        service.methods = methods;
        service.logger
            ? service.logger.info(
                  "Methods were set, There are " +
                      Object.keys(methods).length +
                      " methods"
              )
            : console.log(
                  "Methods were set" + Object.keys(methods).length + " methods"
              );

        const routes = require("./lib/getRoutes")(service);
        let routesCout: number = 0;
        routes.map((i: any) => {
            routesCout += Number(i.routeTree.size);
        });
        elysia.use(routes);
        service.logger
            ? service.logger.info(
                  "Routes were set, There are " + routesCout + " routes"
              )
            : console.log(
                  "Routes were set, There are " + routesCout + " routes"
              );
    } else {
        service.logger
            ? service.logger.warn(
                  "There is no modules folder, so no models & methods & routes were set"
              )
            : console.log(
                  "There is no modules folder, so no models & methods & routes were set"
              );
    }

    elysia.get("/check", "ok");

    elysia.use(corsjs({ origin: cors ? cors : [] }));

    elysia.listen(apiPort, () => {
        service.logger
            ? service.logger.info(`Server running on port ${apiPort}`)
            : console.log(`Server running on port ${apiPort}`);
    });
}
