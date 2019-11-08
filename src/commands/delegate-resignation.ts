import { Interfaces } from "@arkecosystem/crypto";
import Command from "@oclif/command";

import { CommandFlags } from "../types";
import { buildTransaction, processCommand, sharedFlags } from "../utils";

export class DelegateResignation extends Command {
    public static description = "Generate a Type 7 transaction";

    public static examples: string[] = [];

    public static flags: CommandFlags = {
        ...sharedFlags,
    };

    public async run(): Promise<{ data: Interfaces.ITransactionData; serialized: string }> {
        const { flags } = this.parse(DelegateResignation);

        const transaction = processCommand(flags, () => buildTransaction(flags, "delegateResignation"));

        return transaction;
    }
}
