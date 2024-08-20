import React, { useState } from "react";
import { useMessagesTemplates } from "../../../../../hooks/reactquery/queries/messagesTemplatesQueries";
import useIntersection from "../../../../../hooks/useIntersection";
import { MessageTemplateType } from "../../../../../types/api";
import Button from "../../../../UI/Buttons/Button";
import Input from "../../../../UI/Inputs/Input";
import EmptyLi from "../../../../UI/Lists/EmptyLi";
import LoadingLi from "../../../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import MessageTemplateForm from "./MessageTemplateForm";
import MessageTemplateItem from "./MessageTemplateItem";

type MessagesTemplatesProps = {
  handleSelectTemplate: (template: MessageTemplateType) => void;
};

const MessagesTemplates = ({
  handleSelectTemplate,
}: MessagesTemplatesProps) => {
  const [newTemplateVisible, setNewTemplateVisible] = useState(false);
  const [search, setSearch] = useState("");

  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useMessagesTemplates(search);

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
      <div className="messages__templates">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  }
  const messagesTemplates = data?.pages.flatMap((page) => page.items);

  return (
    <div className="messages__templates">
      <div className="messages__templates-btn-container">
        <Button
          onClick={handleAddNew}
          disabled={newTemplateVisible}
          label="Add a new template"
        />
      </div>
      <div className="messages__templates-search">
        <Input
          width={300}
          id="template-search"
          value={search}
          onChange={handleSearch}
          placeholder="Template name, author name,..."
          label="Search"
          autoFocus={true}
        />
      </div>
      <div className="messages__templates-list" ref={divRef}>
        <ul>
          {isPending ? (
            <LoadingLi />
          ) : messagesTemplates && messagesTemplates.length > 0 ? (
            messagesTemplates.map((template, index) =>
              index === messagesTemplates.length - 1 ? (
                <MessageTemplateItem
                  template={template}
                  handleSelectTemplate={handleSelectTemplate}
                  key={template.id}
                  lastItemRef={lastItemRef}
                />
              ) : (
                <MessageTemplateItem
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
            title="NEW MESSAGE TEMPLATE"
            width={900}
            height={550}
            x={(window.innerWidth - 900) / 2}
            y={(window.innerHeight - 550) / 2}
            color="#93B5E9"
            setPopUpVisible={setNewTemplateVisible}
          >
            <MessageTemplateForm
              setNewTemplateVisible={setNewTemplateVisible}
            />
          </FakeWindow>
        )}
      </div>
    </div>
  );
};

export default MessagesTemplates;
