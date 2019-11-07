import { Identities } from "@arkecosystem/crypto";
import Command, { flags } from "@oclif/command";
import { ensureDirSync } from "fs-extra";
import { resolve } from "path";

import { CommandFlags } from "../types";
import { sharedFlags } from "../utils";
import { DelegateRegistration } from "./delegate-registration";
import { DelegateResignation } from "./delegate-resignation";
import { HtlcClaim } from "./htlc-claim";
import { HtlcLock } from "./htlc-lock";
import { HtlcRefund } from "./htlc-refund";
import { IPFS } from "./ipfs";
import { MultiPayment } from "./multi-payment";
import { MultiSignatureRegistration } from "./multi-signature-registration";
import { SecondSignatureRegistration } from "./second-signature-registration";
import { Transfer } from "./transfer";
import { Unvote } from "./unvote";
import { Vote } from "./vote";

interface TransactionType {
    command: any;
    file: string;
}

export class Bulk extends Command {
    public static description = "Generate fixtures for all possible signing scenarios";

    public static examples: string[] = [];

    public static flags: CommandFlags = {
        ...sharedFlags,
        vendorField: flags.string({ default: "this is a top secret vendor field" }),
    };

    private transactionTypes = [
        {
            command: DelegateRegistration,
            file: "delegate-registration",
        },
        {
            command: DelegateResignation,
            file: "delegate-resignation",
        },
        {
            command: HtlcClaim,
            file: "htlc-claim",
        },
        {
            command: HtlcLock,
            file: "htlc-lock",
        },
        {
            command: HtlcRefund,
            file: "htlc-refund",
        },
        {
            command: IPFS,
            file: "ipfs",
        },
        {
            command: MultiPayment,
            file: "multi-payment",
        },
        {
            command: Transfer,
            file: "transfer",
        },
        {
            command: Unvote,
            file: "unvote",
        },
        {
            command: Vote,
            file: "vote",
        },
    ];

    private transactionTypesWithVendorField = [
        {
            command: HtlcLock,
            file: "htlc-lock-with-vendor-field",
        },
        {
            command: MultiPayment,
            file: "multi-payment-with-vendor-field",
        },
        {
            command: Transfer,
            file: "transfer-with-vendor-field",
        },
    ];

    private fixturePath: string = resolve(__dirname, "../../fixtures");

    public async run(): Promise<void> {
        ensureDirSync(this.fixturePath);

        const { flags } = this.parse(Bulk);

        if (!flags.passphrase) {
            flags.passphrase = "this is a top secret passphrase";
        }

        if (!flags.secondPassphrase) {
            flags.secondPassphrase = "this is a top secret second passphrase";
        }

        if (!flags.multiPassphrases) {
            flags.multiPassphrases = [
                "this is a top secret passphrase 1",
                "this is a top secret passphrase 2",
                "this is a top secret passphrase 3",
            ].join(";");
        }

        if (!flags.vendorField) {
            flags.vendorField = "this is a top secret vendor field";
        }

        // Generate a 3x fixtures for every type
        for (const transactionType of this.transactionTypes) {
            await this.sign(transactionType, flags.passphrase as string);

            await this.secondSign(transactionType, flags.passphrase as string, flags.secondPassphrase as string);

            await this.multiSign(transactionType, flags.multiPassphrases as string);
        }

        // Generate a 3x fixtures for every type that allows a vendor field
        const vendorField: string[] = ["--vendorField", flags.vendorField as string];

        for (const transactionType of this.transactionTypesWithVendorField) {
            await this.sign(transactionType, flags.passphrase as string, vendorField);

            await this.secondSign(
                transactionType,
                flags.passphrase as string,
                flags.secondPassphrase as string,
                vendorField,
            );

            await this.multiSign(transactionType, flags.multiPassphrases as string, vendorField);
        }

        // Multi Signature Registration
        await MultiSignatureRegistration.run([
            "--multiPassphrases",
            (flags.multiPassphrases as string)
                .split(";")
                .map((passphrase: string) => Identities.PublicKey.fromPassphrase(passphrase))
                .join(";"),
            "--file",
            `${this.fixturePath}/multi-signature-registration.json`,
        ]);

        // Second Signature Registration
        await SecondSignatureRegistration.run([
            "--passphrase",
            flags.passphrase as string,
            "--secondPassphrase",
            flags.secondPassphrase as string,
            "--file",
            `${this.fixturePath}/second-signature-registration.json`,
        ]);
    }

    private async sign(transactionType: TransactionType, passphrase: string, args = []): Promise<void> {
        return transactionType.command.run(
            ["--passphrase", passphrase, "--file", `${this.fixturePath}/${transactionType.file}-sign.json`].concat(
                args,
            ),
        );
    }

    private async secondSign(
        transactionType: TransactionType,
        passphrase: string,
        secondPassphrase: string,
        args = [],
    ): Promise<void> {
        return transactionType.command.run(
            [
                "--passphrase",
                passphrase,
                "--secondPassphrase",
                secondPassphrase,
                "--file",
                `${this.fixturePath}/${transactionType.file}-secondSign.json`,
            ].concat(args),
        );
    }

    private async multiSign(transactionType: TransactionType, multiPassphrases: string, args = []): Promise<void> {
        return transactionType.command.run(
            [
                "--multiPassphrases",
                multiPassphrases,
                "--file",
                `${this.fixturePath}/${transactionType.file}-multiSign.json`,
            ].concat(args),
        );
    }
}
