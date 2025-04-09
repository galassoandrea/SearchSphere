import fs from "fs";
import path from "path";

const rawPath = path.join(__dirname, "../data/train-v2.0.json");
const outputPath = path.join(__dirname, "../data/squadContexts.json");

const rawData = fs.readFileSync(rawPath, "utf8");
const json = JSON.parse(rawData);

const allContexts: { id: number; content: string }[] = [];

let idCounter = 1;

json.data.forEach((article: any) => {
  article.paragraphs.forEach((p: any) => {
    if (p.context && typeof p.context === "string") {
      allContexts.push({
        id: idCounter++,
        content: p.context.trim(),
      });
    }
  });
});

// Trim to first 100 items for performance
const sliced = allContexts.slice(0, 100);

fs.writeFileSync(outputPath, JSON.stringify(sliced, null, 2), "utf8");

console.log(`✅ Extracted ${sliced.length} contexts to squadContexts.json`);