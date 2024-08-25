const isEmpty = (element: ChildNode): boolean => {
  return (
    !element.hasChildNodes() ||
    [...element.childNodes].every(
      (child) =>
        (child.nodeType === 3 && /^\s*$/.test(child.nodeValue ?? "")) || // Text node with only whitespace
        (child.nodeType === 1 && isEmpty(child)) // Empty element
    )
  );
};
// Recursive function to traverse and remove empty tags
const removeEmptyTagsRecursive = (element: HTMLElement | ChildNode) => {
  const children = element.childNodes;

  for (let i = children.length - 1; i >= 0; i--) {
    const child = children[i];

    // If the node is an element and is empty, remove it
    if (child.nodeType === 1 && isEmpty(child)) {
      element.removeChild(child);
    } else if (child.nodeType === 1) {
      // If the node is a non-empty element, recursion
      removeEmptyTagsRecursive(child);
    }
  }
};
export const removeEmptyTags = (xmlString: string) => {
  try {
    // Create a DOM object from the XML string
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
      // Handle parsing error, e.g., log the error
      console.error(
        "XML parsing error:",
        xmlDoc.getElementsByTagName("parsererror")[0].textContent
      );
      return xmlString; // Return the original XML string
    }
    // Call the recursive function to remove empty tags
    removeEmptyTagsRecursive(xmlDoc.documentElement);
    // Return the modified XML string
    return new XMLSerializer().serializeToString(xmlDoc);
  } catch (error) {
    console.error("Error processing XML:", error);
    return xmlString; // Return the original XML string in case of an error
  }
};
