import { Socket } from "socket.io";
import { jwtDecrypt } from "jose";
import { hkdf as nodeHkdf } from "crypto";
import { promisify } from "util";
import { AUTH_SECRET } from "../config";
import { AuthenticatedSocket } from "../types";

const hkdf = promisify(nodeHkdf);

const alg = "dir";
const enc = "A256CBC-HS512";

async function getDerivedEncryptionKey(secret: string, salt: string) {
  const length = enc === "A256CBC-HS512" ? 64 : 32;
  const keyBuffer = await hkdf(
    "sha256",
    Buffer.from(secret, "utf8"),      // input key material
    Buffer.from(salt, "utf8"),        // salt
    `Auth.js Generated Encryption Key (${salt})`,
    length
  );

  return new Uint8Array(keyBuffer);   // ✅ jose expects Uint8Array
}

async function decryptToken(token: string, isDev: boolean) {
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

export const authMiddleware = async (
  socket: Socket,
  next: (err?: Error) => void
) => {
  const token = socket.handshake.auth.token || socket.handshake.query.token;

  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const payload = await decryptToken(token, true);

    if (!payload?.sub) {
      return next(new Error("Authentication error: Invalid token payload"));
    }

    (socket as AuthenticatedSocket).userId = payload.sub;
    console.log("Decrypted payload:", payload);

    next();
  } catch (err) {
    console.error("Decryption error:", err);
    next(new Error("Authentication error: Token validation failed"));
  }
};
