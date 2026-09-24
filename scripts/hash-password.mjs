#!/usr/bin/env node
// Generates the ADMIN_PASSWORD_HASH (and a fresh SESSION_SECRET) to paste into
// Vercel → Project → Settings → Environment Variables.
//
//   npm run admin:hash
//
// The password is typed at a hidden prompt, so it never lands in your shell
// history. Parameters must match src/lib/auth/password.ts.
import { randomBytes, scrypt } from "node:crypto";
import readline from "node:readline";
import { promisify } from "node:util";

const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 };
const MIN_LENGTH = 12;

function readPasswords() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: process.stdin.isTTY,
  });

  if (process.stdin.isTTY) {
    // Echo nothing while the password is typed.
    rl._writeToOutput = (text) => {
      if (text.includes(":")) rl.output.write(text.slice(0, text.indexOf(":") + 2));
    };
  }

  const answers = [];
  const prompts = ["New admin password: ", "Repeat it: "];
  return new Promise((resolve) => {
    const ask = () => {
      rl.question(prompts[answers.length], (answer) => {
        answers.push(answer);
        if (process.stdin.isTTY) process.stdout.write("\n");
        if (answers.length === prompts.length) {
          rl.close();
          resolve(answers);
        } else {
          ask();
        }
      });
    };
    ask();
  });
}

const [password, repeat] = await readPasswords();

if (password !== repeat) {
  console.error("\nThe two passwords didn't match — nothing was generated.");
  process.exit(1);
}
if (password.length < MIN_LENGTH) {
  console.error(`\nUse at least ${MIN_LENGTH} characters.`);
  process.exit(1);
}

const salt = randomBytes(16);
const hash = await promisify(scrypt)(password, salt, 64, SCRYPT_PARAMS);

console.log(`
Add these to Vercel (Settings → Environment Variables), then redeploy:

ADMIN_PASSWORD_HASH=scrypt:${salt.toString("hex")}:${hash.toString("hex")}
SESSION_SECRET=${randomBytes(32).toString("base64url")}

(Keep SESSION_SECRET the same afterwards — changing it signs everyone out.)`);
