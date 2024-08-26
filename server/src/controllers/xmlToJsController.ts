import { Request, Response } from "express";
import xml2js from "xml2js";
const { stripPrefix } = xml2js.processors;

export const postXmlToJs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { xmlContent } = req.body;
    const parser = new xml2js.Parser({
      explicitArray: false,
      tagNameProcessors: [stripPrefix],
    });

    const result = await parser.parseStringPromise(xmlContent);
    res.status(200).json(result);
  } catch (err) {
    // Handle cases where `err` is not an instance of `Error`
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};
