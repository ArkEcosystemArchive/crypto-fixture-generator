import Command, { flags } from "@oclif/command";

import { CommandFlags } from "../types";
import { sharedFlags } from "../utils";
import { DelegateRegistration } from "./delegate-registration";
import { DelegateResignation } from "./delegate-resignation";
import { HtlcClaim } from "./htlc-claim";
import { HtlcLock } from "./htlc-lock";
import { HtlcRefund } from "./htlc-refund";
import { IPFS } from "./ipfs";
import { MultiPayment } from "./multi-payment";
import { MultiSignature } from "./multi-signature";
import { SecondSignatureRegistration } from "./second-signature-registration";
import { Transfer } from "./transfer";
import { Unvote } from "./unvote";
import { Vote } from "./vote";

export class Bulk extends Command {
    public static description = "Generate fixtures for all possible signing scenarios";

    public static examples: string[] = [];

    public static flags: CommandFlags = {
        ...sharedFlags,
    };

    private transactionTypes = [
        DelegateRegistration,
        DelegateResignation,
        HtlcClaim,
        HtlcLock,
        HtlcRefund,
        IPFS,
        MultiPayment,
        MultiSignature,
        SecondSignatureRegistration,
        Transfer,
        Unvote,
        Vote,
    ];

    public async run(): Promise<void> {
        const { flags } = this.parse(Bulk);

        // todo: add vendor field scenarios
        // todo: write all fixtures to files

        // Generate with a signature
        for (const transactionType of this.transactionTypes) {
            transactionType.run(["--passphrase", flags.passphrase as string]);
        }

        // Generate with a second signature
        for (const transactionType of this.transactionTypes) {
            transactionType.run([
                "--passphrase",
                flags.passphrase as string,
                "--secondPassphrase",
                flags.secondPassphrase as string,
            ]);
        }

        // Generate with multiple signatures
        for (const transactionType of this.transactionTypes) {
            transactionType.run([
                "--passphrase",
                flags.passphrase as string,
                "--multiPassphrases",
                flags.multiPassphrases as string,
            ]);
        }
    }
}
