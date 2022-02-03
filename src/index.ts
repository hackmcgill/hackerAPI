import "reflect-metadata";
import createApplication from "./app";

(async () => {
    const application = await createApplication();
    application.listen(process.env.PORT || 3000);
})();
