import Command, { flags } from "@oclif/command";

import { CommandFlags } from "../types";
import { buildTransaction, processCommand, sharedFlags } from "../utils";

export class Vote extends Command {
    public static description = "Generate a Type 3 transaction";

    public static examples: string[] = [];

    public static flags: CommandFlags = {
        ...sharedFlags,
        delegate: flags.string({ default: "022cca9529ec97a772156c152a00aad155ee6708243e65c9d211a589cb5d43234d" }),
    };

    public async run(): Promise<void> {
        const { flags } = this.parse(Vote);

        processCommand(flags, () =>
            buildTransaction(flags, "vote", builder => builder.votesAsset([`+${flags.delegate}`])),
        );
    }
}
