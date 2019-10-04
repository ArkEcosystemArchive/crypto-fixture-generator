import { Crypto } from "@arkecosystem/crypto";
import Command, { flags } from "@oclif/command";

import { CommandFlags } from "../types";
import { processCommand, sharedFlags } from "../utils";

export class Message extends Command {
    public static description = "Generate a new message";

    public static examples: string[] = [];

    public static flags: CommandFlags = {
        ...sharedFlags,
        message: flags.string({ default: "Hello World" }),
    };

    public async run(): Promise<void> {
        const { flags } = this.parse(Message);

        const passphrase: string = flags.passphrase as string;
        const message: string = flags.message as string;

        processCommand(flags, () => ({
            data: Crypto.Message.sign(message, passphrase),
            passphrase,
        }));
    }
}
