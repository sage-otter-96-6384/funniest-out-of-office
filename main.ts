// The Funniest Out-of-Office — make.fun entry.
// Writes a single line of an out-of-office auto-reply to entry.txt.
//
// The reply: a person who checked whether anything was urgent (it isn't),
// and who knows the printer is never urgent. The twist is that the
// auto-reply did the triage the sender was supposed to do.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I'm out of the office until Monday. If this is urgent, it isn't — I checked. If it's about the printer, it never is.";
const MAX_CHARS = 140;

function checkEntry(text: string): void {
  if (text.length === 0 || text.length > MAX_CHARS) {
    throw new Error(`entry must be 1 to ${MAX_CHARS} characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("entry must be a single line, no line breaks");
  }
  // Strict UTF-8 round-trip: the gate reads the file as UTF-8, so any
  // character that does not survive a strict decode/encode is a failure here,
  // not in front of the judge.
  const bytes = new TextEncoder().encode(text);
  const decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  if (decoded !== text) {
    throw new Error("entry does not survive a strict UTF-8 round-trip");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
checkEntry(ENTRY);
mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, ENTRY, "utf8");
// Read it back: the file the judge sees must be exactly the reply, byte for byte.
if (readFileSync(target, "utf8") !== ENTRY) {
  throw new Error("entry.txt does not match the reply");
}
console.log(`wrote ${target} (${ENTRY.length} chars, 1 line)`);
