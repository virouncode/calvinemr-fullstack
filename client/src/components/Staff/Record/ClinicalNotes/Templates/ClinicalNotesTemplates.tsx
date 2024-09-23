import React, { useState } from "react";
import { useClinicalNotesTemplates } from "../../../../../hooks/reactquery/queries/clinicalNotesTemplatesQueries";
import useIntersection from "../../../../../hooks/useIntersection";
import { ClinicalNoteTemplateType } from "../../../../../types/api";
import Button from "../../../../UI/Buttons/Button";
import Input from "../../../../UI/Inputs/Input";
import EmptyLi from "../../../../UI/Lists/EmptyLi";
import LoadingLi from "../../../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import ClinicalNotesTemplateEdit from "./ClinicalNotesTemplateEdit";
import ClinicalNotesTemplateForm from "./ClinicalNotesTemplateForm";
import ClinicalNotesTemplatesItem from "./ClinicalNotesTemplatesItem";

type ClinicalNotesTemplatesProps = {
  handleSelectTemplate: (template: ClinicalNoteTemplateType) => void;
};

const ClinicalNotesTemplates = ({
  handleSelectTemplate,
}: ClinicalNotesTemplatesProps) => {
  //Hooks
  const [editTemplateVisible, setEditTemplateVisible] = useState(false);
  const [newTemplateVisible, setNewTemplateVisible] = useState(false);
  const [templateToEditId, setTemplateToEditId] = useState<number>();
  const [search, setSearch] = useState("");
  //Queries
  const {
    data: templates,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useClinicalNotesTemplates(search);
  //Intersection observer
  const { divRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  const handleEdit = (templateId: number) => {
    setTemplateToEditId(templateId);
    setEditTemplateVisible(true);
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const handleAddNew = () => {
    setNewTemplateVisible((v) => !v);
  };

  if (error) {
    return (
      <div className="templates">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  }

  const templatesDatas = templates?.pages.flatMap((page) => page.items);

  return (
    <div className="templates">
      <div className="templates__btn-container">
        <Button onClick={handleAddNew} label="Add a new template" />
      </div>
      <div className="templates__search">
        <Input
          value={search}
          onChange={handleSearch}
          id="template-search"
          label="Search"
          width={300}
          autoFocus={true}
          placeholder="Template name, author name"
        />
      </div>
      <div className="templates__list" ref={divRef}>
        <ul>
          {isPending ? (
            <LoadingLi />
          ) : templatesDatas && templatesDatas.length > 0 ? (
            templatesDatas.map((template, index) =>
              index === templatesDatas.length - 1 ? (
                <ClinicalNotesTemplatesItem
                  template={template}
                  handleSelectTemplate={handleSelectTemplate}
                  handleEdit={handleEdit}
                  key={template.id}
                  lastItemRef={lastItemRef}
                />
              ) : (
                <ClinicalNotesTemplatesItem
                  template={template}
                  handleSelectTemplate={handleSelectTemplate}
                  handleEdit={handleEdit}
                  key={template.id}
                />
              )
            )
          ) : (
            !isFetchingNextPage && <EmptyLi text="No results found" />
          )}
          {isFetchingNextPage && <LoadingLi />}
        </ul>
      </div>
      {newTemplateVisible && (
        <FakeWindow
          title="NEW TEMPLATE"
          width={1000}
          height={500}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 500) / 2}
          color="#93b5e9"
          setPopUpVisible={setNewTemplateVisible}
          closeCross={false}
        >
          <ClinicalNotesTemplateForm
            setNewTemplateVisible={setNewTemplateVisible}
          />
        </FakeWindow>
      )}
      {editTemplateVisible && (
        <FakeWindow
          title="EDIT TEMPLATE"
          width={1000}
          height={500}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 500) / 2}
          color="#93b5e9"
          setPopUpVisible={setEditTemplateVisible}
        >
          <ClinicalNotesTemplateEdit
            setEditTemplateVisible={setEditTemplateVisible}
            templateToEdit={
              templatesDatas?.find(
                ({ id }) => id === templateToEditId
              ) as ClinicalNoteTemplateType
            }
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default ClinicalNotesTemplates;
