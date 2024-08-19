import React, { useState } from "react";
import { useFaxesTemplates } from "../../../../hooks/reactquery/queries/faxesTemplatesQueries";
import useIntersection from "../../../../hooks/useIntersection";
import { FaxTemplateType } from "../../../../types/api";
import Button from "../../../UI/Buttons/Button";
import Input from "../../../UI/Inputs/Input";
import EmptyLi from "../../../UI/Lists/EmptyLi";
import LoadingLi from "../../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../../UI/Paragraphs/ErrorParagraph";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import FaxTemplateForm from "./FaxTemplateForm";
import FaxTemplateItem from "./FaxTemplateItem";

type FaxesTemplatesProps = {
  handleSelectTemplate: (template: FaxTemplateType) => void;
};

const FaxesTemplates = ({ handleSelectTemplate }: FaxesTemplatesProps) => {
  const [newTemplateVisible, setNewTemplateVisible] = useState(false);
  const [search, setSearch] = useState("");
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useFaxesTemplates(search);

  const { divRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  const handleAddNew = () => {
    setNewTemplateVisible(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
  };

  if (error) {
    return (
      <div className="fax__templates">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  }
  const faxesTemplates = data?.pages.flatMap((page) => page.items);

  return (
    <div className="fax__templates">
      <div className="fax__templates-btn-container">
        <Button
          onClick={handleAddNew}
          label="Add a new template"
          disabled={newTemplateVisible}
        />
      </div>
      <div className="fax__templates-search">
        <Input
          value={search}
          onChange={handleSearch}
          id="template-search"
          label="Search"
          width={300}
          placeholder="Template name, author name,..."
          autoFocus={true}
        />
      </div>
      <div className="fax__templates-list" ref={divRef}>
        <ul>
          {isPending ? (
            <LoadingLi />
          ) : faxesTemplates && faxesTemplates.length > 0 ? (
            faxesTemplates.map((template, index) =>
              index === faxesTemplates.length - 1 ? (
                <FaxTemplateItem
                  template={template}
                  handleSelectTemplate={handleSelectTemplate}
                  key={template.id}
                  lastItemRef={lastItemRef}
                />
              ) : (
                <FaxTemplateItem
                  template={template}
                  handleSelectTemplate={handleSelectTemplate}
                  key={template.id}
                />
              )
            )
          ) : (
            !isFetchingNextPage && <EmptyLi text="No results found" />
          )}
          {isFetchingNextPage && <LoadingLi />}
        </ul>
        {newTemplateVisible && (
          <FakeWindow
            title="NEW FAX TEMPLATE"
            width={900}
            height={550}
            x={(window.innerWidth - 900) / 2}
            y={(window.innerHeight - 550) / 2}
            color="#93B5E9"
            setPopUpVisible={setNewTemplateVisible}
          >
            <FaxTemplateForm setNewTemplateVisible={setNewTemplateVisible} />
          </FakeWindow>
        )}
      </div>
    </div>
  );
};

export default FaxesTemplates;
