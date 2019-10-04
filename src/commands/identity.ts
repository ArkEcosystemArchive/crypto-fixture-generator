import { Identities } from "@arkecosystem/crypto";
import Command from "@oclif/command";

import { CommandFlags } from "../types";
import { processCommand, sharedFlags } from "../utils";

export class Identity extends Command {
    public static description = "Generate a new identity";

    public static examples: string[] = [];

    public static flags: CommandFlags = {
        ...sharedFlags,
    };

    public async run(): Promise<void> {
        const { flags } = this.parse(Identity);

        const passphrase: string = flags.passphrase as string;

        processCommand(flags, () => ({
            data: {
                privateKey: Identities.PrivateKey.fromPassphrase(passphrase),
                publicKey: Identities.PublicKey.fromPassphrase(passphrase),
                address: Identities.Address.fromPassphrase(passphrase),
                wif: Identities.WIF.fromPassphrase(passphrase),
            },
            passphrase,
        }));
    }
}
