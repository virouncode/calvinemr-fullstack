import React, { useState } from "react";
import { useCalvinAITemplates } from "../../../hooks/reactquery/queries/calvinaiTemplatesQueries";
import useIntersection from "../../../hooks/useIntersection";
import { CalvinAITemplateType } from "../../../types/api";
import Button from "../../UI/Buttons/Button";
import Input from "../../UI/Inputs/Input";
import EmptyLi from "../../UI/Lists/EmptyLi";
import LoadingLi from "../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import FakeWindow from "../../UI/Windows/FakeWindow";
import CalvinAITemplateEdit from "./CalvinAITemplateEdit";
import CalvinAITemplateForm from "./CalvinAITemplateForm";
import CalvinAITemplateItem from "./CalvinAITemplateItem";

type CalvinAIChatTemplatesProps = {
  handleSelectTemplate: (template: CalvinAITemplateType) => void;
};

const CalvinAIChatTemplates = ({
  handleSelectTemplate,
}: CalvinAIChatTemplatesProps) => {
  const [editTemplateVisible, setEditTemplateVisible] = useState(false);
  const [newTemplateVisible, setNewTemplateVisible] = useState(false);
  const [templateToEditId, setTemplateToEditId] = useState<number | undefined>(
    undefined
  );
  const [search, setSearch] = useState("");
  const {
    data: templates,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useCalvinAITemplates(search);

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
  const handleAddNew = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setNewTemplateVisible((v) => !v);
  };

  if (error) {
    return (
      <div className="calvinai-chat__templates">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  }

  const templatesDatas = templates?.pages.flatMap((page) => page.items);

  return (
    <div className="calvinai-chat__templates">
      <div className="calvinai-chat__templates-btn-container">
        <Button onClick={handleAddNew} label="Add a new template" />
      </div>
      <div className="calvinai-chat__templates-search">
        <Input
          value={search}
          onChange={handleSearch}
          id="template-search"
          label="Search"
          placeholder="Template name, author name"
          autoFocus={true}
          width={300}
        />
      </div>
      <div className="calvinai-chat__templates-list" ref={divRef}>
        <ul>
          {isPending ? (
            <LoadingLi />
          ) : templatesDatas && templatesDatas.length > 0 ? (
            templatesDatas.map((template, index) =>
              index === templatesDatas.length - 1 ? (
                <CalvinAITemplateItem
                  template={template}
                  handleSelectTemplate={handleSelectTemplate}
                  handleEdit={handleEdit}
                  key={template.id}
                  lastItemRef={lastItemRef}
                />
              ) : (
                <CalvinAITemplateItem
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
          <CalvinAITemplateForm setNewTemplateVisible={setNewTemplateVisible} />
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
          <CalvinAITemplateEdit
            setEditTemplateVisible={setEditTemplateVisible}
            templateToEdit={templatesDatas?.find(
              ({ id }) => id === templateToEditId
            )}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default CalvinAIChatTemplates;
