import Command from "@oclif/command";

import { CommandFlags } from "../types";
import { buildTransaction, processCommand, sharedFlags } from "../utils";

export class DelegateResignation extends Command {
    public static description = "Generate a Type 7 transaction";

    public static examples: string[] = [];

    public static flags: CommandFlags = {
        ...sharedFlags,
    };

    public async run(): Promise<void> {
        const { flags } = this.parse(DelegateResignation);

        processCommand(flags, () => buildTransaction(flags, "delegateResignation"));
    }
}
