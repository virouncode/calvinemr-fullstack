import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import React, { useState } from "react";
import useIntersection from "../../../../../../hooks/useIntersection";
import {
  AllergyType,
  MedTemplateType,
  XanoPaginatedType,
} from "../../../../../../types/api";
import Button from "../../../../../UI/Buttons/Button";
import ExclamationTriangleIcon from "../../../../../UI/Icons/ExclamationTriangleIcon";
import Input from "../../../../../UI/Inputs/Input";
import EmptyLi from "../../../../../UI/Lists/EmptyLi";
import LoadingLi from "../../../../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../../../../UI/Windows/FakeWindow";
import MedTemplateForm from "./MedTemplateForm";
import MedTemplateItem from "./MedTemplateItem";

type MedsTemplatesListProps = {
  medsTemplates:
    | InfiniteData<XanoPaginatedType<MedTemplateType>, unknown>
    | undefined;
  progress: boolean;
  isPendingTemplates: boolean;
  errorTemplates: Error | null;
  isFetchingNextPageTemplates: boolean;
  fetchNextPageTemplates: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<XanoPaginatedType<MedTemplateType>, unknown>,
      Error
    >
  >;
  isFetchingTemplates: boolean;
  search: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  allergies: AllergyType[];
  handleSelectTemplate: (template: MedTemplateType) => void;
};

const MedsTemplatesList = ({
  medsTemplates,
  progress,
  isPendingTemplates,
  errorTemplates,
  isFetchingNextPageTemplates,
  fetchNextPageTemplates,
  isFetchingTemplates,
  search,
  handleSearch,
  allergies,
  handleSelectTemplate,
}: MedsTemplatesListProps) => {
  const [newVisible, setNewVisible] = useState(false);
  const { ulRef, lastItemRef } = useIntersection(
    isFetchingNextPageTemplates,
    fetchNextPageTemplates,
    isFetchingTemplates
  );

  const handleNew = () => {
    setNewVisible(true);
  };

  if (errorTemplates)
    return (
      <div className="med-templates__list">
        <ErrorParagraph errorMsg={errorTemplates.message} />
      </div>
    );

  const medsTemplatesDatas = medsTemplates?.pages.flatMap((page) => page.items);

  return (
    <div className="med-templates__list">
      <div className="medications-form__title">
        <Button
          onClick={handleNew}
          disabled={progress}
          label="Add a new template"
        />
      </div>
      <div className="med-templates__search">
        <Input
          label="Search"
          placeholder="Drug name, author name..."
          value={search}
          onChange={handleSearch}
          autoFocus
          id="med-template-search"
          width={300}
        />
      </div>
      <div className="med-templates__allergies">
        <ExclamationTriangleIcon /> Patient Allergies :{" "}
        {allergies && allergies.length > 0
          ? allergies
              .map(({ OffendingAgentDescription }) => OffendingAgentDescription)
              .join(", ")
          : "No allergies"}
      </div>
      <ul ref={ulRef}>
        {isPendingTemplates ? (
          <LoadingParagraph />
        ) : medsTemplatesDatas && medsTemplatesDatas.length > 0 ? (
          medsTemplatesDatas.map((med, index) =>
            index === medsTemplatesDatas.length - 1 ? (
              <MedTemplateItem
                med={med}
                key={med.id}
                handleSelectTemplate={handleSelectTemplate}
                lastItemRef={lastItemRef}
              />
            ) : (
              <MedTemplateItem
                med={med}
                key={med.id}
                handleSelectTemplate={handleSelectTemplate}
              />
            )
          )
        ) : (
          !isFetchingNextPageTemplates && <EmptyLi text="No results found" />
        )}
        {isFetchingNextPageTemplates && <LoadingLi />}
      </ul>
      {newVisible && (
        <FakeWindow
          title="NEW MEDICATION TEMPLATE"
          width={600}
          height={750}
          x={(window.innerWidth - 600) / 2}
          y={(window.innerHeight - 750) / 2}
          color="#931621"
          setPopUpVisible={setNewVisible}
        >
          <MedTemplateForm setNewVisible={setNewVisible} />
        </FakeWindow>
      )}
    </div>
  );
};

export default MedsTemplatesList;
