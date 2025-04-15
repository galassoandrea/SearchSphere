import fs from "fs";
import path from "path";

// Define data paths
const rawPath = path.join(__dirname, "../data/train-v2.0.json");
const outputPath = path.join(__dirname, "../data/squadContexts.json");

// Load and parse the raw data
const rawData = fs.readFileSync(rawPath, "utf8");
const json = JSON.parse(rawData);

// Function to randomly shuffle the documents
function shuffle<T>(array: T[]): T[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

const allContexts: { id: number; content: string }[] = [];
let idCounter = 1;

// Extract contexts from the raw data
json.data.forEach((article: any) => {
  const firstParagraph = article.paragraphs[0]?.context?.trim();
  if (firstParagraph) {
    allContexts.push({
      id: idCounter++,
      content: firstParagraph,
    });
  }
});

// Shuffle the contexts randomly and sample 100 items
const shuffled = shuffle(allContexts);
const sliced = shuffled.slice(0, 100);

// Save the extracted contexts to a new JSON file
fs.writeFileSync(outputPath, JSON.stringify(sliced, null, 2), "utf8");
console.log(`Extracted ${sliced.length} contexts to squadContexts.json`);