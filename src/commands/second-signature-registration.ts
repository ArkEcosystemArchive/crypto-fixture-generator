import { Managers, Transactions, Types } from "@arkecosystem/crypto";
import Command from "@oclif/command";

import { CommandFlags } from "../types";
import { processCommand, sharedFlags } from "../utils";

export class SecondSignatureRegistration extends Command {
    public static description = "Generate a Type 1 transaction";

    public static examples: string[] = [];

    public static flags: CommandFlags = {
        ...sharedFlags,
    };

    public async run(): Promise<void> {
        const { flags } = this.parse(SecondSignatureRegistration);

        Managers.configManager.setFromPreset(flags.network as Types.NetworkName);

        processCommand(flags, () => {
            const transaction = Transactions.BuilderFactory.secondSignature()
                .signatureAsset(flags.secondPassphrase as string)
                .sign(flags.passphrase as string)
                .build();

            return {
                data: transaction.data,
                serialized: transaction.serialized.toString("hex"),
            };
        });
    }
}
