import { Interfaces } from "@arkecosystem/crypto";
import Command, { flags } from "@oclif/command";

import { CommandFlags } from "../types";
import { buildTransaction, processCommand, sharedFlags } from "../utils";

export class MultiSignatureRegistration extends Command {
    public static description = "Generate a Type 4 transaction";

    public static examples: string[] = [];

    public static flags: CommandFlags = {
        ...sharedFlags,
        publicKeys: flags.string({
            default:
                "039180ea4a8a803ee11ecb462bb8f9613fcdb5fe917e292dbcc73409f0e98f8f22,028d3611c4f32feca3e6713992ae9387e18a0e01954046511878fe078703324dc0,021d3932ab673230486d0f956d05b9e88791ee298d9af2d6df7d9ed5bb861c92dd",
        }),
        min: flags.integer({ default: 2 }),
    };

    public async run(): Promise<{ data: Interfaces.ITransactionData; serialized: string }> {
        const { flags } = this.parse(MultiSignatureRegistration);

        const transaction = processCommand(flags, () =>
            buildTransaction(flags, "multiSignature", builder =>
                builder.multiSignatureAsset({
                    publicKeys: ((flags.publicKeys as string).split(",") as unknown) as string[],
                    min: flags.min as number,
                }),
            ),
        );

        return transaction;
    }
}
