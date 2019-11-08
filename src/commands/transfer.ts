import { Identities, Interfaces } from "@arkecosystem/crypto";
import Command, { flags } from "@oclif/command";

import { CommandFlags } from "../types";
import { buildTransaction, processCommand, sharedFlags } from "../utils";

export class Transfer extends Command {
    public static description = "Generate a Type 0 transaction";

    public static examples: string[] = [];

    public static flags: CommandFlags = {
        ...sharedFlags,
        recipient: flags.string({ default: "AGeYmgbg2LgGxRW2vNNJvQ88PknEJsYizC" }),
        amount: flags.string({ default: "200000000" }),
        vendorField: flags.string(),
    };

    public async run(): Promise<{ data: Interfaces.ITransactionData; serialized: string }> {
        const { flags } = this.parse(Transfer);

        const transaction = processCommand(flags, () =>
            buildTransaction(flags, "transfer", builder => {
                builder
                    .recipientId(
                        (flags.recipient as string) || Identities.Address.fromPassphrase(flags.passphrase as string),
                    )
                    .amount(flags.amount as string);

                if (flags.vendorField) {
                    builder.vendorField(flags.vendorField as string);
                }
            }),
        );

        return transaction;
    }
}
