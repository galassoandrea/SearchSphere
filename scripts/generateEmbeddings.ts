import { OpenAI } from "openai";
import fs from "fs";
import path from "path";

// Load your OpenAI API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Load the extracted contexts
const contextsPath = path.join(__dirname, "../data/squadContexts.json");
const contexts = JSON.parse(fs.readFileSync(contextsPath, "utf8"));

async function generateEmbeddings() {
  const embeddings = [];

  // Generate embeddings for each context
  for (let i = 0; i < contexts.length; i++) {
    try {
      const response = await openai.embeddings.create({
        model: "text-embedding-ada-002", // Use OpenAI's ADA model for embeddings
        input: contexts[i].content,
      });

      embeddings.push({
        id: contexts[i].id,
        content: contexts[i].content,
        embedding: response.data[0].embedding,
      });

      if (i % 10 === 0) {
        console.log(`Processed ${i + 1} contexts...`);
      }
    } catch (error) {
      console.error(`Error embedding context ${i + 1}:`, error);
    }
  }

  // Save the embeddings to a file
  fs.writeFileSync(
    path.join(__dirname, "../data/embeddings.json"),
    JSON.stringify(embeddings, null, 2),
    "utf8"
  );
  
  console.log("✅ Embeddings saved to /data/embeddings.json");
}

generateEmbeddings();