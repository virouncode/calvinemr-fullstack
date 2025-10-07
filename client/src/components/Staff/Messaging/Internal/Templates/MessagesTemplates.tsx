import { useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  useMessagesFavoritesTemplates,
  useMessagesTemplates,
} from "../../../../../hooks/reactquery/queries/messagesTemplatesQueries";
import useDebounce from "../../../../../hooks/useDebounce";
import useIntersection from "../../../../../hooks/useIntersection";
import { MessageTemplateType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
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
  const { user } = useUserContext() as { user: UserStaffType };
  const [newTemplateVisible, setNewTemplateVisible] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");
  //Queries
  const {
    data: templates,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useMessagesTemplates(debouncedSearch);

  const {
    data: favoritesTemplates,
    isPending: isPendingFavorites,
    error: errorFavorites,
  } = useMessagesFavoritesTemplates(user.id, debouncedSearch);
  //Intersection observer
  const { rootRef, targetRef } = useIntersection<HTMLDivElement | null>(
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

  if (error || errorFavorites) {
    return (
      <div className="templates">
        <ErrorParagraph
          errorMsg={error?.message ?? errorFavorites?.message ?? ""}
        />
      </div>
    );
  }

  const favoritesTemplatesIds = favoritesTemplates?.map(({ id }) => id);
  const allTemplatesDatas = templates?.pages
    .flatMap((page) => page.items)
    .filter(({ id }) => !favoritesTemplatesIds?.includes(id));

  const templatesDatas = [
    ...(favoritesTemplates ?? []),
    ...(allTemplatesDatas ?? []),
  ];

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
      <div className="templates__list" ref={rootRef}>
        <ul>
          {isPending ? (
            <LoadingLi />
          ) : templatesDatas && templatesDatas.length > 0 ? (
            templatesDatas.map((template, index) =>
              index === templatesDatas.length - 1 ? (
                <MessageTemplateItem
                  template={template}
                  handleSelectTemplate={handleSelectTemplate}
                  key={template.id}
                  targetRef={targetRef}
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
