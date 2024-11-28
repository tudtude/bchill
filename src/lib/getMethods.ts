module.exports = (service: any) => {
    const methods: any = {};

    const processDir = ({ dir, dirTarget, name }: any) => {
        methods[`${name}`] = require(`${dirTarget}/${dir}/methods/${name}`)(
            service
        );
    };

    try {
        require("./getModules")({ type: "methods", processDir });
    } catch (e) {
        console.error(e);
    }

    return methods;
};
