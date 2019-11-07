import { Identities, Interfaces, Managers, Transactions, Types } from "@arkecosystem/crypto";
import { flags } from "@oclif/command";
import { writeSync } from "clipboardy";
import { writeFileSync } from "fs";

import { CommandFlags } from "./types";

export const sharedFlags = {
    // Config
    network: flags.string({ default: "testnet" }),
    // Output
    copy: flags.boolean(),
    log: flags.boolean(),
    file: flags.string(),
    // Encrypt
    passphrase: flags.string({ default: "this is a top secret passphrase" }),
    secondPassphrase: flags.string(),
    multiPassphrases: flags.string(),
};

export const toJson = <T>(value: T): string => JSON.stringify(value, null, 4);

export const writeToFile = <T>(data: T, file: string): void => writeFileSync(file, toJson(data));

export const logToTerminal = <T>(data: T): void => console.log(toJson(data));

export const copyToClipboard = <T>(data: T): void => writeSync(toJson(data));

export const processCommand = <T>(flags: CommandFlags, callback: () => T): void => {
    const data = callback();

    if (flags.copy) {
        copyToClipboard(data);
    }

    if (flags.log) {
        logToTerminal(data);
    }

    if (flags.file) {
        writeToFile(data, flags.file);
    }
};

export const buildTransaction = (
    flags,
    type: string,
    callback?: (builder) => void,
): { data: Interfaces.ITransactionData; serialized: string } => {
    Managers.configManager.setFromPreset(flags.network as Types.NetworkName);

    const builder = Transactions.BuilderFactory[type]();

    if (callback) {
        callback(builder);
    }

    if (!flags.multiPassphrases) {
        builder.sign((flags.passphrase as unknown) as string);
    }

    if (flags.secondPassphrase) {
        builder.secondSign((flags.secondPassphrase as unknown) as string);
    }

    if (flags.multiPassphrases) {
        const passphrases: string[] = flags.multiPassphrases.split(";");

        builder.senderPublicKey(
            Identities.PublicKey.fromMultiSignatureAsset({
                min: flags.min || 2,
                publicKeys: passphrases.map((passphrase: string) => Identities.PublicKey.fromPassphrase(passphrase)),
            }),
        );

        for (let i = 0; i < passphrases.length; i++) {
            builder.multiSign(passphrases[i], i);
        }

        builder.sign(passphrases[0]);

        // todo
        // if (type === "multiSignature") {
        //     builder.sign(passphrases[0]);
        // }
    }

    const transaction: Interfaces.ITransaction = builder.build();

    if (!transaction.verify()) {
        console.log([
            type,
            transaction.data,
            Transactions.Verifier.verify(transaction.data),
            Transactions.Verifier.verifyHash(transaction.data),
        ]);

        throw new Error(`Failed to verify ${transaction.id} of type ${transaction.type}.`);
    }

    console.log(
        `Generated: Type ${transaction.type} | ${!!transaction.data.signature} | ${!!transaction.data
            .secondSignature} | ${!!transaction.data.signatures}`,
    );

    return {
        data: transaction.data,
        serialized: transaction.serialized.toString("hex"),
    };
};
