import { pipeline } from '@xenova/transformers';
import fs from 'fs/promises';

// Function to load the dataset of documents
const loadDocuments = async () => {
  const raw = await fs.readFile('data/squadContexts.json', 'utf-8');
  return JSON.parse(raw);
};

// Function to save the generated embeddings to a file
const saveEmbeddings = async (embeddings: { id: string; title: string; content: string; embedding: number[] }[]) => {
  await fs.writeFile('data/embeddings.json', JSON.stringify(embeddings, null, 2), 'utf-8');
};

// Function to generate embeddings for the documents
const generateEmbeddings = async () => {

  // Load the dataset containing the documents
  const documents = await loadDocuments();

  // Load the Sentence Transformer model for feature extraction
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

  const results = [];
  // Extract embeddings for each document
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
  console.log('Embeddings generated!');
};

generateEmbeddings();