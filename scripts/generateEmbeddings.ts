import { pipeline } from '@xenova/transformers';
import fs from 'fs/promises';

// Load your dataset (adjust path as needed)
const loadDocuments = async () => {
  const raw = await fs.readFile('data/squadContexts.json', 'utf-8');
  return JSON.parse(raw);
};

const saveEmbeddings = async (embeddings: any) => {
  await fs.writeFile('data/embeddings.json', JSON.stringify(embeddings, null, 2), 'utf-8');
};

const generateEmbeddings = async () => {

  // Load the dataset containing the documents
  const documents = await loadDocuments();

  // Load the Sentence Transformer model for feature extraction
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

  const results = [];
  for (const doc of documents) {
    const output = await extractor(doc.content, { pooling: 'mean', normalize: true });

    // Ensure output.data is an array of numbers
    const embedding = Object.values(output.data);
    results.push({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      embedding: embedding,
    });
  }

  // Save the embeddings to a file
  await saveEmbeddings(results);
  console.log('✅ Embeddings generated!');
};

generateEmbeddings();