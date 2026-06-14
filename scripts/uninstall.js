#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const os = require("os");

const skillsDir = path.join(__dirname, "..", "skills");
const targetDir = path.join(os.homedir(), ".claude", "skills");

// Discover skills dynamically — match whatever the bundled package contains
const SKILLS = fs.existsSync(skillsDir)
  ? fs
      .readdirSync(skillsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(skillsDir, entry.name, "SKILL.md")))
      .map((entry) => entry.name)
  : [];

let removed = [];

for (const skill of SKILLS) {
  const dest = path.join(targetDir, skill);

  if (fs.existsSync(dest)) {
    const stat = fs.lstatSync(dest);
    if (stat.isSymbolicLink()) {
      fs.unlinkSync(dest);
      removed.push(skill);
    } else {
      console.log(`  ⚠  ${skill} is not a symlink — skipping (remove manually if needed)`);
    }
  }
}

if (removed.length) {
  console.log(`\n✦ cami-design uninstalled`);
  console.log(`  Removed: ${removed.join(", ")}`);
}

console.log("");
