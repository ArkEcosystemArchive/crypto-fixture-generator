import { Crypto, Identities, Interfaces, Managers, Transactions, Types } from "@arkecosystem/crypto";
import { flags } from "@oclif/command";
import { writeSync } from "clipboardy";
import { writeFileSync } from "fs";

import { CommandFlags } from "./types";

export const sharedFlags = {
    // Config
    network: flags.string({ default: "testnet" }),
    // Output
    copy: flags.boolean({ default: false }),
    log: flags.boolean({ default: true }),
    file: flags.string(),
    // Encrypt
    passphrase: flags.string({ default: "this is a top secret passphrase" }),
    secondPassphrase: flags.string(),
    multiPassphrases: flags.string(),
    ecdsa: flags.boolean({ default: false }),
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

    if (flags.useEcdsa) {
        const keys: Interfaces.IKeyPair = Identities.Keys.fromPassphrase((flags.passphrase as unknown) as string);
        builder.data.senderPublicKey = keys.publicKey;

        const signatureBuffer: Buffer = Transactions.Utils.toHash(builder.data, {
            excludeSignature: true,
            excludeSecondSignature: true,
        });

        builder.data.signature = Crypto.Hash.signECDSA(
            signatureBuffer,
            Identities.Keys.fromPassphrase((flags.passphrase as unknown) as string),
        );

        if (flags.secondPassphrase) {
            const secondSignatureBuffer: Buffer = Transactions.Utils.toHash(builder.data, {
                excludeSignature: false,
                excludeSecondSignature: true,
            });

            builder.data.secondSignature = Crypto.Hash.signECDSA(
                secondSignatureBuffer,
                Identities.Keys.fromPassphrase((flags.secondPassphrase as unknown) as string),
            );
        }
    } else {
        builder.sign((flags.passphrase as unknown) as string);

        if (flags.secondPassphrase) {
            builder.secondSign((flags.secondPassphrase as unknown) as string);
        }

        if (flags.multiPassphrases) {
            const passphrases: string[] = flags.multiPassphrases.split(";");

            for (let i = 0; i < passphrases.length; i++) {
                builder.multiSign(passphrases[i], i);
            }
        }
    }

    const transaction: Interfaces.ITransaction = builder.build();

    return {
        data: transaction.data,
        serialized: transaction.serialized.toString("hex"),
    };
};
