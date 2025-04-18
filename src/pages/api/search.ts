import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { pipeline } from '@xenova/transformers';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { GoogleGenAI } from "@google/genai";

// Cosine similarity function
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (magA * magB);
}

// Load extractor model
const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

// Specify parameters to access to Gemini API for the generator model
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const query = req.query.q as string;
  
  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter ?q=' });
  }

  // Load saved embeddings
  const filePath = path.resolve(process.cwd(), 'data', 'embeddings.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const documents = JSON.parse(raw);

  // Generate embedding for query using the extractor model
  const extractorOutput = await extractor(query, { pooling: 'mean', normalize: true });
  const queryEmbedding: number[] = Object.values(extractorOutput.data);

  // Compute similarities between query and each document embedding
  const scored = documents.map((doc: { embedding: number[]; id: string; content: string }) => ({
    ...doc,
    score: cosineSimilarity(queryEmbedding, doc.embedding),
  }));

  // Filter out low relevance results
  const filtered = scored.filter((doc: { score: number; }) => doc.score > 0.3);

  // Extract the top 2 matching documents
  const topResults = filtered
    .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
    .slice(0, 2);

  // Concatenate the content of the top results for the prompt
  const context = topResults.map((doc: { content: string; }) => doc.content).join('\n\n');

  // Prepare the prompt for the generator model
  const prompt = `You are a Q&A search engine. Use only the provided context to answer
   the following question. Only in the case in which the answer can't be derived
   from the provided context, use your knowledge to answer.
   Also, when the answer is generated from the context, please, insert as first line of the answer the phrase "Answer derived from the provided documents\n\n" highlighting it, while
   when the answer is generated from your knowledge, please, insert as first line of the answer the phrase "Answer derived from my knowledge\n\n" highlighting it.
   Please, generate a human-friendly answer
   containing between 10 and 30 lines.\n\nContext:\n${context}\n\nQuestion:
   ${query}\n\nAnswer:`;

  // Generate the answer using a Gemini model with the Gemini API
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const result = response.text || "No answer generated.";

    // Return generated answer and source documents
    res.status(200).json({ 
      answer: result,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate answer', error: err });
  }
}