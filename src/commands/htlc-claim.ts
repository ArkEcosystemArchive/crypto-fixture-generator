import Command, { flags } from "@oclif/command";

import { CommandFlags } from "../types";
import { buildTransaction, processCommand, sharedFlags } from "../utils";

export class SecondSignatureRegistration extends Command {
    public static description = "Generate a Type 9 transaction";

    public static examples: string[] = [];

    public static flags: CommandFlags = {
        ...sharedFlags,
        lockTransactionId: flags.string({
            default: "943c220691e711c39c79d437ce185748a0018940e1a4144293af9d05627d2eb4",
        }),
        unlockSecret: flags.string({ default: "my secret that should be 32bytes" }),
    };

    public async run(): Promise<void> {
        const { flags } = this.parse(SecondSignatureRegistration);

        processCommand(flags, () =>
            buildTransaction(flags, "htlcClaim", builder =>
                builder.htlcClaimAsset({
                    lockTransactionId: flags.lockTransactionId as string,
                    unlockSecret: flags.unlockSecret as string,
                }),
            ),
        );
    }
}
