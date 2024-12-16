export const reverseFromRichText = (formattedText: string): string => {
  // Replace <p><br></p> with a single empty line (newline character)
  let reversedText = formattedText.replace(/<p><br><\/p>/g, "\n");

  // Replace <p>...</p> with the content inside the <p> tags, ensuring a newline at the end of each paragraph
  reversedText = reversedText.replace(/<p>(.*?)<\/p>/g, "$1\n");

  // Trim any extra newlines at the start or end of the text
  return reversedText.trim();
};
