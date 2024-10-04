import { useMediaQuery } from "@mui/material";
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
import MessageTemplateFormMobile from "./MessageTemplateFormMobile";
import MessageTemplateItem from "./MessageTemplateItem";

type MessagesTemplatesProps = {
  handleSelectTemplate: (template: MessageTemplateType) => void;
};

const MessagesTemplates = ({
  handleSelectTemplate,
}: MessagesTemplatesProps) => {
  //Hooks
  const [newTemplateVisible, setNewTemplateVisible] = useState(false);
  const [search, setSearch] = useState("");
  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");
  //Queries
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useMessagesTemplates(search);
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
          width={300}
          id="template-search"
          value={search}
          onChange={handleSearch}
          placeholder="Template name, author name,..."
          label="Search"
          autoFocus={true}
        />
      </div>
      <div className="templates__list" ref={divRef}>
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
            height={630}
            x={(window.innerWidth - 900) / 2}
            y={(window.innerHeight - 630) / 2}
            color="#8fb4fb"
            setPopUpVisible={setNewTemplateVisible}
          >
            {isTabletOrMobile ? (
              <MessageTemplateFormMobile
                setNewTemplateVisible={setNewTemplateVisible}
              />
            ) : (
              <MessageTemplateForm
                setNewTemplateVisible={setNewTemplateVisible}
              />
            )}
          </FakeWindow>
        )}
      </div>
    </div>
  );
};

export default MessagesTemplates;
