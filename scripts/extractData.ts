import fs from "fs";
import path from "path";

// Define data paths
const rawPath = path.join(__dirname, "../data/train-v2.0.json");
const outputPath = path.join(__dirname, "../data/squadContexts.json");

// Load and parse the raw data
const rawData = fs.readFileSync(rawPath, "utf8");
const json = JSON.parse(rawData);

const allContexts: { id: number; content: string }[] = [];
let idCounter = 1;

// Extract the first 2 paragraphs from each raw article
json.data.forEach((article: { paragraphs: { context: string }[] }) => {
  const totalParagraphs = article.paragraphs.length;

  // Only proceed if the article has at least 2 paragraphs
  if (totalParagraphs >= 2) {
    const first = article.paragraphs[0]?.context?.trim();
    const second = article.paragraphs[1]?.context?.trim();

    [first, second].forEach((paragraph) => {
      if (paragraph) {
        allContexts.push({
          id: idCounter++,
          content: paragraph,
        });
      }
    });
  } else {
    // If there is just one paragraph, take it
    const paragraph = article.paragraphs[0]?.context?.trim();

    if (paragraph) {
        allContexts.push({
          id: idCounter++,
          content: paragraph,
        });
    }
  }
});

// Save the extracted contexts to a new JSON file
fs.writeFileSync(outputPath, JSON.stringify(allContexts, null, 2), "utf8");
console.log(`Extracted ${allContexts.length} contexts to squadContexts.json`);