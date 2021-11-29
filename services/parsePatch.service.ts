import { Request } from "express";

function parsePatch(req: Request, model: Object, done: () => {}) {
    setMatchingAttributes(req, model).then(() => {
        done();
    });
}

async function setMatchingAttributes(req: Request, model: Object) {
    let modelDetails: any = {};
    for (const val in req.body) {
        if (model.hasOwnProperty(val)) {
            modelDetails[val] = req.body[val];
            delete req.body[val];
        }
    }
    req.body.modelDetails = modelDetails;
}

export { parsePatch };
