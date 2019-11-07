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

    private transactionTypesWithVendorField = [HtlcLock, MultiPayment, Transfer];

    public async run(): Promise<void> {
        const { flags } = this.parse(Bulk);

        // todo: write all fixtures to files

        // Generate a 3x fixtures for every type
        for (const transactionType of this.transactionTypes) {
            this.sign(transactionType, flags.passphrase as string);
            this.secondSign(transactionType, flags.passphrase as string, flags.secondPassphrase as string);
            this.multiSign(transactionType, flags.multiPassphrases as string);
        }

        // Generate a 3x fixtures for every type that allows a vendor field
        for (const transactionType of this.transactionTypesWithVendorField) {
            this.sign(transactionType, flags.passphrase as string);
            this.secondSign(transactionType, flags.passphrase as string, flags.secondPassphrase as string);
            this.multiSign(transactionType, flags.multiPassphrases as string);
        }
    }

    private sign(transactionType, passphrase: string): void {
        transactionType.run(["--passphrase", passphrase]);
    }

    private secondSign(transactionType, passphrase: string, secondPassphrase: string): void {
        transactionType.run(["--passphrase", passphrase, "--secondPassphrase", secondPassphrase]);
    }

    private multiSign(transactionType, multiPassphrases: string): void {
        transactionType.run(["--multiPassphrases", multiPassphrases]);
    }
}
