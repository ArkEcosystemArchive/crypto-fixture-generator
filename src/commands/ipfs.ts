import Command, { flags } from "@oclif/command";

import { CommandFlags } from "../types";
import { buildTransaction, processCommand, sharedFlags } from "../utils";

export class IPFS extends Command {
    public static description = "Generate a Type 5 transaction";

    public static examples: string[] = [];

    public static flags: CommandFlags = {
        ...sharedFlags,
        hash: flags.string({ default: "QmR45FmbVVrixReBwJkhEKde2qwHYaQzGxu4ZoDeswuF9w" }),
    };

    public async run(): Promise<void> {
        const { flags } = this.parse(IPFS);

        processCommand(flags, () =>
            buildTransaction(flags, "ipfs", builder => builder.ipfsAsset(flags.hash as string)),
        );
    }
}
