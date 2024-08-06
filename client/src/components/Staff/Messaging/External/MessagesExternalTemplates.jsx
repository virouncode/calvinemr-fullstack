import { useState } from "react";
import { useMessagesExternalTemplates } from "../../../../hooks/reactquery/queries/messagesTemplatesQueries";
import useIntersection from "../../../../hooks/useIntersection";
import Button from "../../../UI/Buttons/Button";
import Input from "../../../UI/Inputs/Input";
import EmptyLi from "../../../UI/Lists/EmptyLi";
import LoadingLi from "../../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../../UI/Paragraphs/ErrorParagraph";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import MessageExternalTemplateForm from "./MessageExternalTemplateForm";
import MessageExternalTemplateItem from "./MessageExternalTemplateItem";

const MessagesExternalTemplates = ({ handleSelectTemplate }) => {
  const [newTemplateVisible, setNewTemplateVisible] = useState(false);
  const [search, setSearch] = useState("");
  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useMessagesExternalTemplates(search);

  const { rootRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  const handleAddNew = () => {
    setNewTemplateVisible(true);
  };

  const handleSearch = (e) => {
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
          value={search}
          onChange={handleSearch}
          id="template-search"
          label="Search"
          placeholder="Template name, author name,..."
          autoFocus={true}
          width={300}
        />
      </div>
      <div className="messages__templates-list" ref={rootRef}>
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
            width={900}
            height={550}
            x={(window.innerWidth - 900) / 2}
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
