import { Identities, Interfaces } from "@arkecosystem/crypto";
import Command, { flags } from "@oclif/command";

import { CommandFlags } from "../types";
import { buildTransaction, processCommand, sharedFlags } from "../utils";

export class HtlcLock extends Command {
    public static description = "Generate a Type 8 transaction";

    public static examples: string[] = [];

    public static flags: CommandFlags = {
        ...sharedFlags,
        recipient: flags.string({ default: "AGeYmgbg2LgGxRW2vNNJvQ88PknEJsYizC" }),
        amount: flags.string({ default: "200000000" }),
        vendorField: flags.string(),
        secretHash: flags.string({
            default: "0f128d401958b1b30ad0d10406f47f9489321017b4614e6cb993fc63913c5454",
        }),
        expirationType: flags.integer({ default: 1 }),
        expirationValue: flags.integer({ default: Math.floor(Date.now() / 1000) }),
    };

    public async run(): Promise<{ data: Interfaces.ITransactionData; serialized: string }> {
        const { flags } = this.parse(HtlcLock);

        const transaction = processCommand(flags, () =>
            buildTransaction(flags, "htlcLock", builder => {
                builder
                    .htlcLockAsset({
                        secretHash: flags.secretHash as string,
                        expiration: {
                            type: flags.expirationType as number,
                            value: flags.expirationValue as number,
                        },
                    })
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
