import { createClient, commandOptions } from "redis";
import { copyFinalDist, downloadS3Folder } from "./aws";
import { buildProject } from "./utils.ts";
const subscriber = createClient();
const publisher = createClient()
subscriber.connect();
publisher.connect();
async function main() {
    while(1) {
        const res = await subscriber.brPop(
            commandOptions({ isolated: true }),
            'build-queue',
            0
          );

        //@ts-ignore
        const id = res.element

        console.log(id)
        await downloadS3Folder(`output/${id}`);
        await buildProject(id);
        await copyFinalDist(id);
        publisher.hSet("deployed", id, new Date().toISOString());
    }
}
main();