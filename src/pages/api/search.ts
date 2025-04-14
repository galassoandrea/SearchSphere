import { NextApiRequest, NextApiResponse } from 'next';
import { pipeline } from '@xenova/transformers';
import fs from 'fs/promises';

// Cosine similarity function
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (magA * magB);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query.q as string;

  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter ?q=' });
  }

  // Load saved embeddings
  const raw = await fs.readFile('data/embeddings.json', 'utf-8');
  const documents = JSON.parse(raw);

  // Load embedding model
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

  // Generate embedding for query
  const output = await extractor(query, { pooling: 'mean', normalize: true });
  const queryEmbedding: number[] = Object.values(output.data);

  // Compute similarities
  const scored = documents.map((doc: any) => ({
    ...doc,
    score: cosineSimilarity(queryEmbedding, doc.embedding),
  }));

  // Sort and return top 5
  const topResults = scored
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 5);

  res.status(200).json({ results: topResults });
}