export const escapeXml = (xmlString: string) => {
  if (typeof xmlString === "number") return xmlString;
  if (xmlString === "") return "";
  return xmlString.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
};
