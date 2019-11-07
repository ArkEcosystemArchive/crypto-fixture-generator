import { Crypto, Identities, Interfaces, Managers, Transactions, Types } from "@arkecosystem/crypto";
import { flags } from "@oclif/command";
import { writeSync } from "clipboardy";
import { writeFileSync } from "fs";

import { CommandFlags } from "./types";

const verifySignatures = (
    transaction: Interfaces.ITransactionData,
    multiSignature: Interfaces.IMultiSignatureAsset,
): boolean => {
    const { publicKeys, min }: Interfaces.IMultiSignatureAsset = multiSignature;
    const { signatures }: Interfaces.ITransactionData = transaction;

    const hash: Buffer = Transactions.Utils.toHash(transaction, {
        excludeSignature: true,
        excludeSecondSignature: true,
        excludeMultiSignature: true,
    });

    const publicKeyIndexes: { [index: number]: boolean } = {};
    let verified = false;
    let verifiedSignatures = 0;
    for (let i = 0; i < signatures.length; i++) {
        const signature: string = signatures[i];
        const publicKeyIndex: number = parseInt(signature.slice(0, 2), 16);

        if (!publicKeyIndexes[publicKeyIndex]) {
            publicKeyIndexes[publicKeyIndex] = true;
        } else {
            throw new Error("DuplicateParticipantInMultiSignatureError");
        }

        const partialSignature: string = signature.slice(2, 130);
        const publicKey: string = publicKeys[publicKeyIndex];

        if (Crypto.Hash.verifySchnorr(hash, partialSignature, publicKey)) {
            verifiedSignatures++;
        }

        if (verifiedSignatures === min) {
            verified = true;
            break;
        } else if (signatures.length - (i + 1 - verifiedSignatures) < min) {
            break;
        }
    }

    return verified;
};

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

        if (type === "multiSignature") {
            builder.sign(passphrases[0]);
        }
    }

    const transaction: Interfaces.ITransaction = builder.build();

    let verified = false;

    if (transaction.data.signatures) {
        verified = verifySignatures(transaction.data, {
            min: flags.min || 2,
            publicKeys: transaction.data.signatures,
        });

        if (!verified) {
            throw new Error("Invalid Multi Signatures");
        }

        if (type === "multiSignature") {
            verified = transaction.verify();
        }
    } else {
        verified = transaction.verify();
    }

    if (!verified) {
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
