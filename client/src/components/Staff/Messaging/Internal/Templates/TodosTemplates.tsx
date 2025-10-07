import React, { useState } from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  useTodosFavoritesTemplates,
  useTodosTemplates,
} from "../../../../../hooks/reactquery/queries/messagesTemplatesQueries";
import useDebounce from "../../../../../hooks/useDebounce";
import useIntersection from "../../../../../hooks/useIntersection";
import { TodoTemplateType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import Button from "../../../../UI/Buttons/Button";
import Input from "../../../../UI/Inputs/Input";
import EmptyLi from "../../../../UI/Lists/EmptyLi";
import LoadingLi from "../../../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import TodoTemplateForm from "./TodoTemplateForm";
import TodoTemplateItem from "./TodoTemplateItem";

type TodosTemplatesProps = {
  handleSelectTemplate: (template: TodoTemplateType) => void;
};

const TodosTemplates = ({ handleSelectTemplate }: TodosTemplatesProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [newTemplateVisible, setNewTemplateVisible] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  //Queries
  const {
    data: templates,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useTodosTemplates(debouncedSearch);
  const {
    data: favoritesTemplates,
    isPending: isPendingFavorites,
    error: errorFavorites,
  } = useTodosFavoritesTemplates(user.id, debouncedSearch);
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
          id="template-search"
          value={search}
          onChange={handleSearch}
          placeholder="Template name, author name,..."
          width={300}
          autoFocus={true}
          label="Search"
        />
      </div>
      <div className="templates__list" ref={rootRef}>
        <ul>
          {isPending ? (
            <LoadingLi />
          ) : templatesDatas && templatesDatas.length > 0 ? (
            templatesDatas.map((template, index) =>
              index === templatesDatas.length - 1 ? (
                <TodoTemplateItem
                  template={template}
                  handleSelectTemplate={handleSelectTemplate}
                  key={template.id}
                  targetRef={targetRef}
                />
              ) : (
                <TodoTemplateItem
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
            title="NEW TO-DO TEMPLATE"
            width={700}
            height={500}
            x={(window.innerWidth - 700) / 2}
            y={(window.innerHeight - 500) / 2}
            color="#8fb4fb"
            setPopUpVisible={setNewTemplateVisible}
          >
            <TodoTemplateForm setNewTemplateVisible={setNewTemplateVisible} />
          </FakeWindow>
        )}
      </div>
    </div>
  );
};

export default TodosTemplates;
