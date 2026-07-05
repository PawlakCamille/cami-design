#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const os = require("os");

const skillsDir = path.join(__dirname, "..", "skills");
const targetDir = path.join(os.homedir(), ".claude", "skills");

// Discover skills dynamically — any directory under skills/ with a SKILL.md
const SKILLS = fs
  .readdirSync(skillsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(skillsDir, entry.name, "SKILL.md")))
  .map((entry) => entry.name);

// Ensure ~/.claude/skills exists
fs.mkdirSync(targetDir, { recursive: true });

let installed = [];
let skipped = [];

for (const skill of SKILLS) {
  const src = path.join(skillsDir, skill);
  const dest = path.join(targetDir, skill);

  // lstatSync (not existsSync) so we detect broken symlinks too: existsSync
  // follows the link and returns false for a dangling one, which used to fall
  // through to symlinkSync and throw EEXIST on reinstall after an uninstall.
  let linkStat = null;
  try {
    linkStat = fs.lstatSync(dest);
  } catch {
    linkStat = null;
  }

  if (linkStat) {
    if (linkStat.isSymbolicLink()) {
      let current = null;
      try {
        current = fs.readlinkSync(dest);
      } catch {
        current = null;
      }
      if (current === src) {
        skipped.push(skill);
        continue;
      }
      // Symlink (possibly broken, or pointing elsewhere): replace it.
      fs.unlinkSync(dest);
    } else {
      // A real file/dir lives here: back it up before linking.
      fs.renameSync(dest, `${dest}.bak`);
      console.log(`  ↩  Backed up existing ${skill} → ${skill}.bak`);
    }
  }

  fs.symlinkSync(src, dest);
  installed.push(skill);
}

if (installed.length) {
  console.log(`\n✦ cami-design installed`);
  console.log(`  Skills linked: ${installed.join(", ")}`);
  console.log(`  Ready to use: ${SKILLS.map((s) => `/${s}`).join(", ")}`);
} else {
  console.log(`\n✦ cami-design already up to date`);
}

console.log("");
