
import LetterAdditionalPagePreview from "./LetterAdditionalPagePreview";

const LetterAdditionalPages = ({
  pages,
  additionalBodies,
  printAdditionalRefs,
  demographicsInfos,
  numberOfPages,
}) => {
  return pages.map((page) => (
    <LetterAdditionalPagePreview
      key={page}
      printAdditionalRefs={printAdditionalRefs}
      demographicsInfos={demographicsInfos}
      additionalBody={additionalBodies[page]}
      page={page}
      numberOfPages={numberOfPages}
    />
  ));
};

export default LetterAdditionalPages;
