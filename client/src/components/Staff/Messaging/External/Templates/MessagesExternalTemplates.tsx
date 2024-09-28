import React, { useState } from "react";
import { useMessagesExternalTemplates } from "../../../../../hooks/reactquery/queries/messagesTemplatesQueries";
import useIntersection from "../../../../../hooks/useIntersection";
import { MessageExternalTemplateType } from "../../../../../types/api";
import Button from "../../../../UI/Buttons/Button";
import Input from "../../../../UI/Inputs/Input";
import EmptyLi from "../../../../UI/Lists/EmptyLi";
import LoadingLi from "../../../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import MessageExternalTemplateForm from "./MessageExternalTemplateForm";
import MessageExternalTemplateItem from "./MessageExternalTemplateItem";

type MessagesExternalTemplatesProps = {
  handleSelectTemplate: (template: MessageExternalTemplateType) => void;
};

const MessagesExternalTemplates = ({
  handleSelectTemplate,
}: MessagesExternalTemplatesProps) => {
  //Hooks
  const [newTemplateVisible, setNewTemplateVisible] = useState(false);
  const [search, setSearch] = useState("");
  //Queries
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useMessagesExternalTemplates(search);
  //Intersection observer
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
      <div className="templates">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  }
  const messagesTemplates = data?.pages.flatMap((page) => page.items);

  return (
    <div className="templates">
      <div className="templates__btn-container">
        <Button
          onClick={handleAddNew}
          disabled={newTemplateVisible}
          label="Add a new template"
        />
      </div>
      <div className="templates__search">
        <Input
          value={search}
          onChange={handleSearch}
          id="template-search"
          label="Search"
          placeholder="Template name, author name,..."
          autoFocus={true}
          width={300}
        />
      </div>
      <div className="templates__list" ref={divRef}>
        <ul>
          {isPending ? (
            <LoadingLi />
          ) : messagesTemplates && messagesTemplates.length > 0 ? (
            messagesTemplates.map((template, index) =>
              index === messagesTemplates.length - 1 ? (
                <MessageExternalTemplateItem
                  template={template}
                  handleSelectTemplate={handleSelectTemplate}
                  key={template.id}
                  lastItemRef={lastItemRef}
                />
              ) : (
                <MessageExternalTemplateItem
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
            title="NEW EXTERNAL MESSAGE TEMPLATE"
            width={700}
            height={550}
            x={(window.innerWidth - 700) / 2}
            y={(window.innerHeight - 550) / 2}
            color="#93B5E9"
            setPopUpVisible={setNewTemplateVisible}
          >
            <MessageExternalTemplateForm
              setNewTemplateVisible={setNewTemplateVisible}
            />
          </FakeWindow>
        )}
      </div>
    </div>
  );
};

export default MessagesExternalTemplates;
