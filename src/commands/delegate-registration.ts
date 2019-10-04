import Command, { flags } from "@oclif/command";

import { CommandFlags } from "../types";
import { buildTransaction, processCommand, sharedFlags } from "../utils";

export class DelegateRegistration extends Command {
    public static description = "Generate a Type 2 transaction";

    public static examples: string[] = [];

    public static flags: CommandFlags = {
        ...sharedFlags,
        username: flags.string({ default: "boldninja" }),
    };

    public async run(): Promise<void> {
        const { flags } = this.parse(DelegateRegistration);

        processCommand(flags, () =>
            buildTransaction(flags, "delegateRegistration", builder => builder.usernameAsset(flags.username as string)),
        );
    }
}
