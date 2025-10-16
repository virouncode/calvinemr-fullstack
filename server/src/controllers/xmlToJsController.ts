import { Request, Response } from "express";
import xml2js from "xml2js";
import { handleSuccess, handleError } from "../utils/helper";

const { stripPrefix } = xml2js.processors;

export const postXmlToJs = async (req: Request, res: Response) => {
  try {
    const { xmlContent } = req.body;

    if (!xmlContent || typeof xmlContent !== "string") {
      throw new Error("Missing or invalid 'xmlContent' in request body");
    }

    const parser = new xml2js.Parser({
      explicitArray: false, // ne pas forcer les tableaux
      tagNameProcessors: [stripPrefix], // retire les préfixes XML type ns:
    });

    const result = await parser.parseStringPromise(xmlContent);

    return handleSuccess({
      result,
      status: 200,
      message: "XML parsed successfully",
      res,
    });
  } catch (err) {
    return handleError({ err, res });
  }
};
