#!/usr/bin/env node
/**
 * Eval runner for pwlk-atelier-design
 * Requires: ANTHROPIC_API_KEY in environment
 * Usage: npm run eval
 *        npm run eval -- --mode copy
 *        npm run eval -- --id copy-001
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

const EVALS_PATH = path.join(__dirname, "..", "evals", "evals.json");
const SKILLS_PATH = path.join(__dirname, "..", "skills");

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error("\n✖ Missing ANTHROPIC_API_KEY environment variable.\n");
  process.exit(1);
}

// --- CLI args ---
const args = process.argv.slice(2);
const filterMode = argValue(args, "--mode");
const filterId = argValue(args, "--id");
const verbose = args.includes("--verbose");

function argValue(args, flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : null;
}

// --- Load skill content ---
function loadSkill(mode) {
  const skillPath = path.join(SKILLS_PATH, mode, "SKILL.md");
  if (!fs.existsSync(skillPath)) return null;
  return fs.readFileSync(skillPath, "utf8");
}

function loadParentSkill() {
  const p = path.join(SKILLS_PATH, "atelier-design", "SKILL.md");
  return fs.readFileSync(p, "utf8");
}

// --- Anthropic API call ---
function callClaude(systemPrompt, userMessage) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const req = https.request(
      {
        hostname: "api.anthropic.com",
        path: "/v1/messages",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) reject(new Error(parsed.error.message));
            else resolve(parsed.content[0].text);
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// --- Judge call ---
function judgeResponse(evalCase, skillResponse) {
  const criteria = JSON.stringify(evalCase.expect, null, 2);
  const judgePrompt = `You are an eval judge for a UI design skill. Your job is to determine if a skill response passes or fails a test case.

Respond ONLY with a JSON object in this exact format:
{
  "pass": true or false,
  "score": 0-100,
  "notes": "one sentence explanation"
}

The eval criteria:
${criteria}

Rules:
- must_mention: the response must reference each of these concepts (exact words not required, meaning counts)
- must_suggest: the response must propose or recommend each of these (explicitly or implicitly)
- must_not: the response must NOT contain these sentiments

Be strict on must_not. Be reasonable on must_mention and must_suggest — paraphrasing counts.`;

  return callClaude(
    judgePrompt,
    `Skill response to judge:\n\n${skillResponse}`
  );
}

// --- Main runner ---
async function run() {
  const corpus = JSON.parse(fs.readFileSync(EVALS_PATH, "utf8"));
  const parentSkill = loadParentSkill();

  let cases = corpus.evals;
  if (filterMode) cases = cases.filter((c) => c.mode === filterMode);
  if (filterId) cases = cases.filter((c) => c.id === filterId);

  if (cases.length === 0) {
    console.log("\n⚠  No eval cases matched your filters.\n");
    process.exit(0);
  }

  console.log(`\n✦ pwlk-atelier-design evals`);
  console.log(`  Running ${cases.length} case${cases.length > 1 ? "s" : ""}...\n`);

  const results = [];

  for (const evalCase of cases) {
    process.stdout.write(`  [${evalCase.id}] ${evalCase.description}... `);

    const modeSkill = loadSkill(evalCase.mode);
    const systemPrompt = [
      "You are a design expert using the following skill:\n\n",
      parentSkill,
      modeSkill ? `\n\n---\nActive mode: ${evalCase.mode}\n\n${modeSkill}` : "",
    ].join("");

    try {
      const skillResponse = await callClaude(systemPrompt, evalCase.input);
      const judgeRaw = await judgeResponse(evalCase, skillResponse);

      let judgment;
      try {
        // Extract JSON even if surrounded by backticks
        const match = judgeRaw.match(/\{[\s\S]*\}/);
        judgment = match ? JSON.parse(match[0]) : { pass: false, score: 0, notes: "Failed to parse judge response" };
      } catch {
        judgment = { pass: false, score: 0, notes: "Failed to parse judge response" };
      }

      const icon = judgment.pass ? "✓" : "✗";
      console.log(`${icon} ${judgment.score}/100`);
      if (!judgment.pass || verbose) {
        console.log(`     ${judgment.notes}`);
      }
      if (verbose) {
        console.log(`\n     --- Skill response ---\n${skillResponse}\n`);
      }

      results.push({ id: evalCase.id, ...judgment });
    } catch (err) {
      console.log(`✗ error`);
      console.log(`     ${err.message}`);
      results.push({ id: evalCase.id, pass: false, score: 0, notes: err.message });
    }
  }

  // Summary
  const passed = results.filter((r) => r.pass).length;
  const total = results.length;
  const avgScore = Math.round(results.reduce((s, r) => s + r.score, 0) / total);
  const allPass = passed === total;

  console.log(`\n${"─".repeat(40)}`);
  console.log(`  ${passed}/${total} passed  ·  avg score ${avgScore}/100`);
  console.log(`  ${allPass ? "✦ All evals passing" : `⚠  ${total - passed} failing`}`);
  console.log();

  process.exit(allPass ? 0 : 1);
}

run().catch((err) => {
  console.error("\n✖ Eval runner crashed:", err.message);
  process.exit(1);
});
