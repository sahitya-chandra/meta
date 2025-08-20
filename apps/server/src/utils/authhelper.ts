import { jwtDecrypt } from "jose";
import { hkdf as nodeHkdf } from "crypto";
import { promisify } from "util";
import { AUTH_SECRET } from "../config";


const hkdf = promisify(nodeHkdf);

const alg = "dir";
const enc = "A256CBC-HS512";

async function getDerivedEncryptionKey(secret: string, salt: string) {
  const length = enc === "A256CBC-HS512" ? 64 : 32;
  const keyBuffer = await hkdf(
    "sha256",
    Buffer.from(secret, "utf8"),
    Buffer.from(salt, "utf8"),
    `Auth.js Generated Encryption Key (${salt})`,
    length
  );
  return new Uint8Array(keyBuffer);
}

export async function decryptToken(token: string, isDev: boolean) {
  const salt = isDev
    ? "authjs.session-token"
    : "__Secure-authjs.session-token";

  const encryptionKey = await getDerivedEncryptionKey(AUTH_SECRET, salt);

  const { payload } = await jwtDecrypt(token, encryptionKey, {
    clockTolerance: 15,
    keyManagementAlgorithms: [alg],
    contentEncryptionAlgorithms: [enc, "A256GCM"],
  });

  return payload;
}
