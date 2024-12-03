const fs = require("fs");
const path = require("path");

module.exports = function ({
    type,
    processDir,
    service,
}: {
    type: string;
    processDir: any;
    service: any;
}) {
    const dirTarget = path.join(process.cwd(), "/modules");
    const dirs = fs.readdirSync(dirTarget);

    if (type === "routes") {
        for (let dir of dirs) {
            if (!fs.existsSync(dirTarget + "/" + dir + "/routes")) return;
            processDir({ dirTarget, dir });
        }
    }

    if (type == "methods") {
        for (let dir of dirs) {
            if (!fs.existsSync(dirTarget + "/" + dir + "/methods")) return;
            let files = fs.readdirSync(dirTarget + "/" + dir + "/methods", {
                withFileTypes: true,
            });
            files = files.filter((file: any) => !file.isDirectory());
            for (let file of files) {
                const name = path.parse(file.name).name;
                processDir({ dirTarget, dir, name });
            }
        }
    }

    if (type == "models") {
        for (let dir of dirs) {
            let files = fs.readdirSync(`${dirTarget}/${dir}`);
            if (files.includes("models")) {
                let names = fs.readdirSync(`${dirTarget}/${dir}/models`);
                for (let name of names) {
                    name = path.parse(name).name;
                    processDir({ dirTarget, dir, name });
                }
            }
        }
    }
};
