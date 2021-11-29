import { version } from "../package.json";

const get = function() {
    return version;
};

export { get };
