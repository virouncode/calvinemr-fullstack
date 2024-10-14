import { DocumentProcessorServiceClient } from "@google-cloud/documentai/build/src/v1"; // Adjust the path based on your setup

import axios from "axios";
import { Request, Response } from "express";
axios.defaults.withCredentials = true;

const projectId = process.env.DOCUMENTAI_PROJECT_ID!;
const location = "us"; // Format is 'us' or 'eu'
const processorId = process.env.DOCUMENTAI_PROCESSOR_ID!;

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

const extractTextFromDoc = async (
  docUrl: string,
  mime: string
): Promise<string[]> => {
  const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;
  // Read the file into memory.
  const response = await axios.get(docUrl, { responseType: "arraybuffer" });
  const encodedImage = Buffer.from(response.data, "binary").toString("base64");
  const request = {
    name,
    rawDocument: {
      content: encodedImage,
      mimeType: mime,
    },
  };

  // Recognizes text entities in the PDF document
  try {
    const [result] = await client.processDocument(request);
    const { document } = result as DocumentAIResponse;

    // Get all of the document text as one big string
    const { text } = document;

    // Extract shards from the text field
    const getText = (textAnchor: {
      textSegments: Array<{ startIndex?: number; endIndex: number }>;
    }) => {
      if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
        return "";
      }

      // First shard in document doesn't have startIndex property
      const startIndex = textAnchor.textSegments[0].startIndex || 0;
      const endIndex = textAnchor.textSegments[0].endIndex;

      return text.substring(startIndex, endIndex);
    };

    // Read the text recognition output from the processor
    const [page1] = document.pages;
    const { paragraphs } = page1;

    const decodedText: string[] = [];

    for (const paragraph of paragraphs) {
      const paragraphText = getText(paragraph.layout.textAnchor);
      decodedText.push(paragraphText);
    }
    return decodedText;
  } catch (err) {
    console.error(err);
    throw new Error("Error processing document");
  }
};

export const postExtractToText = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { docUrl, mime } = req.body;
    const result = await extractTextFromDoc(docUrl, mime);
    res.status(200).send(result);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Unknown error occurred" });
    }
  }
};
