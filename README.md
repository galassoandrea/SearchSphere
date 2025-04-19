# 🔍 SearchSphere

SearchSphere is a very simple RAG Q&A search engine built using Next.js.  
It allows users to write natural language queries and then generates a relevant answer based on a set of documents from the SQuAD 2.0 dataset or from its memory.

---

## 📌 How It Works

1. The dataset is preprocessed to extract and embed documents using a pretrained Sentence Transformer model.
2. These embeddings are saved in a local JSON file for efficient retrieval.
3. When a user enters a query, it is embedded using the same model.
4. Documents and query are compared by computing the cosine similarity.
5. The top 2 most similar documents based on the similarity score are returned and concatenated into a context variable.
6. This context variable is passed inside a well-engineered prompt.
7. The prompt is used to guide a Gemini model in generating a useful answer, which is then displayed in the results page.

---

## 💬 Example Queries

Here there are some example queries that you can use to test the engine and get an answer generated from the information contained in the SQuAD 2.0 dataset.

- Who was Frédéric Chopin?
- What awards has Beyoncé won?
- What are Beyoncé’s notable achievements?
- What is Post-punk?
- Where did Chopin spend most of his life?
- What is a web browser?
- When was the French and Indian War?
- Who fought in the French and Indian war?

There are also other queries that can be formulated and used for this purpose. If you want, you can analize the dataset to see what information it contains and generate a related query.

In general, you can pass to the model any other query related to information not contained in the dataset and it will answer based on its previous (pretrained) knowledge.
