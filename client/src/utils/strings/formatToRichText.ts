export const formatToRichText = (text: string): string => {
  const lines = text.split(/\r?\n/);
  const formattedText = lines
    .map((line) => {
      if (line.trim() === "") {
        // If the line is empty, return <p><br/></p>
        return "<p><br/></p>";
      } else {
        // Otherwise, wrap the line in <p>Line</p>
        return `<p>${line}</p>`;
      }
    })
    .join(""); // Join all the formatted lines into one string

  return formattedText;
};
