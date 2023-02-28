import { ModuleBuilder } from "https://deno.land/x/icarus@0.1.0/mod.ts";

export const ConfigModule = new ModuleBuilder("config")
  .build(() => {
    const configFields = new Map<
      string,
      { description?: string; value?: string }
    >();

    return {
      fields: () => Object.fromEntries(configFields.entries()),
      logFields: () => {
        console.log(Array.from(
          configFields.entries(),
          ([key, value]) => ({ key, description: value.description }),
        ));
      },
      get: (key: string, description?: string) => {
        const cfg = configFields.get(key);
        if (cfg?.value) return cfg.value;

        const value = Deno.env.get(key) ?? prompt(
          `Input value for [${description ?? cfg?.description ?? key}]:`,
        );

        if (value) {
          console.log(`Setting ${key} to ${value}`);
          configFields.set(key, {
            description: description ?? cfg?.description,
            value: value,
          });
          return value;
        } else {
          console.error("No value found, setting to undefined");
          configFields.set(key, {
            description: description ?? cfg?.description,
            value: undefined,
          });
          return undefined;
        }
      },
    };
  });
