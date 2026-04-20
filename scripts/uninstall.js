#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const os = require("os");

const SKILLS = ["atelier-design", "atelier-design-layout", "atelier-design-interaction", "atelier-design-copy"];
const targetDir = path.join(os.homedir(), ".claude", "skills");

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
  console.log(`\n✦ pwlk-atelier-design uninstalled`);
  console.log(`  Removed: ${removed.join(", ")}\n`);
}
