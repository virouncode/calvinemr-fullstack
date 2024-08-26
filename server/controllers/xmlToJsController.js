const xml2js = require("xml2js");
const stripPrefix = require("xml2js").processors.stripPrefix;

const postXmlToJs = (req, res) => {
  const { xmlContent } = req.body;
  const parser = new xml2js.Parser({
    explicitArray: false,
    tagNameProcessors: [stripPrefix],
  });
  parser
    .parseStringPromise(xmlContent)
    .then((result) => res.status(200).send(result))
    .catch((err) => res.status(400).send(err));
};

module.exports = { postXmlToJs };
