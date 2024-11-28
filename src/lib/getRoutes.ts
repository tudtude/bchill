module.exports = (input: any) => {
    let routes: any = [];

    const processDir = ({ dirTarget, dir }: any) => {
        routes.push(require(dirTarget + "/" + dir + "/routes")(input));
    };

    try {
        require("./getModules")({ type: "routes", processDir });
    } catch (e) {
        console.error(e);
    }

    return routes;
};
