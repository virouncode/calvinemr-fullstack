import React from "react";
import { DemographicsType } from "../../../../../../types/api";
import LetterAdditionalPagePreview from "./LetterAdditionalPagePreview";

type LetterAdditionalPagesProps = {
  pages: number[];
  additionalBodies: string[];
  printAdditionalRefs: React.MutableRefObject<HTMLDivElement[] | null>;
  demographicsInfos: DemographicsType;
  numberOfPages: number;
};

const LetterAdditionalPages = ({
  pages,
  additionalBodies,
  printAdditionalRefs,
  demographicsInfos,
  numberOfPages,
}: LetterAdditionalPagesProps) => {
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
