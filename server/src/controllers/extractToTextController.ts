import { DocumentProcessorServiceClient } from "@google-cloud/documentai/build/src/v1";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { fetchWithTimeout } from "../utils/fetchWithTimeout";
import { handleError, handleSuccess } from "../utils/helper";

dotenv.config();

const projectId = process.env.DOCUMENTAI_PROJECT_ID;
const location = "us"; // Format is 'us' or 'eu'
const processorId = process.env.DOCUMENTAI_PROCESSOR_ID;

const client = new DocumentProcessorServiceClient();

interface DocumentAIResponse {
  document: {
    text: string;
    pages: Array<{
      paragraphs: Array<{
        layout: {
          textAnchor: {
            textSegments: Array<{
              startIndex?: number;
              endIndex: number;
            }>;
          };
        };
      }>;
    }>;
  };
}

// 📘 Utilitaire pour extraire le texte d’un document depuis son URL
const extractTextFromDoc = async (
  docUrl: string,
  mime: string
): Promise<string[]> => {
  const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

  // 1️⃣ Lecture du fichier avec timeout
  const response = await fetchWithTimeout(docUrl, { method: "GET" }, 10000);
  if (!response.ok) {
    throw new Error(`Failed to fetch document: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const encodedImage = Buffer.from(arrayBuffer).toString("base64");

  // 2️⃣ Prépare la requête DocumentAI
  const request = {
    name,
    rawDocument: {
      content: encodedImage,
      mimeType: mime,
    },
  };

  // 3️⃣ Traitement via Google DocumentAI
  try {
    const [result] = await client.processDocument(request);
    const { document } = result as DocumentAIResponse;

    const { text } = document;
    const [page1] = document.pages;
    const { paragraphs } = page1;

    // 4️⃣ Extraction du texte
    const getText = (textAnchor: {
      textSegments: Array<{ startIndex?: number; endIndex: number }>;
    }) => {
      if (!textAnchor.textSegments?.length) return "";
      const { startIndex = 0, endIndex } = textAnchor.textSegments[0];
      return text.substring(startIndex, endIndex);
    };

    const decodedText: string[] = paragraphs.map((p) =>
      getText(p.layout.textAnchor)
    );

    return decodedText;
  } catch (err) {
    console.error("DocumentAI processing error:", err);
    throw new Error("Error processing document with Google DocumentAI");
  }
};

// 🎯 Contrôleur Express standardisé
export const postExtractToText = async (req: Request, res: Response) => {
  try {
    const { docUrl, mime } = req.body;
    if (!docUrl || !mime) {
      throw new Error("Missing required parameters: docUrl or mime");
    }

    const result = await extractTextFromDoc(docUrl, mime);

    return handleSuccess({
      result,
      status: 200,
      message: "Text extracted successfully",
      res,
    });
  } catch (err) {
    return handleError({ err, res });
  }
};
