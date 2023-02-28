import { ModuleBuilder, start } from "https://deno.land/x/icarus@0.1.0/mod.ts";
import { ConfigModule } from "./mod.ts";

const testModule = new ModuleBuilder("test")
  .addDependency(ConfigModule)
  .build((deps) => {
    const port = deps.config.get("LISTEN_PORT", "Port to listen on");
    const host = deps.config.get("LISTEN_HOST", "Hostname to listen on");

    if (!port) throw new Error("Cannot have no port");

    return {
      start: () => console.log("Listening on", host ?? "localhost", +port),
    };
  });

const mods = await start([
  testModule,
  ConfigModule,
]);

mods.config.logFields();
mods.test.start();
