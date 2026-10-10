#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();

const source = path.join(
  root,
  "assets",
  "ml",
  "final_model",
  "model.onnx"
);

const destinationDir = path.join(
  root,
  "android",
  "app",
  "src",
  "main",
  "assets",
  "ml"
);

const destination = path.join(destinationDir, "model.onnx");

if (!fs.existsSync(source)) {
  console.error(`❌ model.onnx not found at: ${source}`);
  process.exit(1);
}

fs.mkdirSync(destinationDir, { recursive: true });

fs.copyFileSync(source, destination);

console.log("✅ model.onnx copied successfully.");
console.log(`From: ${source}`);
console.log(`To:   ${destination}`);