#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const os = require("os");

const SKILLS = ["atelier-design", "atelier-design-layout", "atelier-design-interaction", "atelier-design-copy"];
const skillsDir = path.join(__dirname, "..", "skills");
const targetDir = path.join(os.homedir(), ".claude", "skills");

// Ensure ~/.claude/skills exists
fs.mkdirSync(targetDir, { recursive: true });

let installed = [];
let skipped = [];

for (const skill of SKILLS) {
  const src = path.join(skillsDir, skill);
  const dest = path.join(targetDir, skill);

  if (fs.existsSync(dest)) {
    const stat = fs.lstatSync(dest);
    if (stat.isSymbolicLink() && fs.readlinkSync(dest) === src) {
      skipped.push(skill);
      continue;
    }
    // Already exists but points elsewhere — back it up
    fs.renameSync(dest, `${dest}.bak`);
    console.log(`  ↩  Backed up existing ${skill} → ${skill}.bak`);
  }

  fs.symlinkSync(src, dest);
  installed.push(skill);
}

if (installed.length) {
  console.log(`\n✦ pwlk-atelier-design installed`);
  console.log(`  Skills linked: ${installed.join(", ")}`);
  console.log(`  Ready to use: /atelier-design, /atelier-design-layout, /atelier-design-interaction, /atelier-design-copy\n`);
} else {
  console.log(`\n✦ pwlk-atelier-design already up to date\n`);
}
