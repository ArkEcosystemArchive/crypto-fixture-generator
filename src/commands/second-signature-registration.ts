import { Interfaces, Managers, Transactions, Types } from "@arkecosystem/crypto";
import Command from "@oclif/command";

import { CommandFlags } from "../types";
import { processCommand, sharedFlags } from "../utils";

export class SecondSignatureRegistration extends Command {
    public static description = "Generate a Type 1 transaction";

    public static examples: string[] = [];

    public static flags: CommandFlags = {
        ...sharedFlags,
    };

    public async run(): Promise<{ data: Interfaces.ITransactionData; serialized: string }> {
        const { flags } = this.parse(SecondSignatureRegistration);

        Managers.configManager.setFromPreset(flags.network as Types.NetworkName);

        const transaction = processCommand(flags, () => {
            const transaction = Transactions.BuilderFactory.secondSignature()
                .signatureAsset(flags.secondPassphrase as string)
                .nonce("1")
                .sign(flags.passphrase as string)
                .build();

            return {
                data: transaction.data,
                serialized: transaction.serialized.toString("hex"),
            };
        });

        return transaction;
    }
}
