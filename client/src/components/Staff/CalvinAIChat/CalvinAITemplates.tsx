import { useState } from "react";

import React from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  useCalvinAIFavoritesTemplates,
  useCalvinAITemplates,
} from "../../../hooks/reactquery/queries/calvinaiTemplatesQueries";
import useDebounce from "../../../hooks/useDebounce";
import useIntersection from "../../../hooks/useIntersection";
import { CalvinAITemplateType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import Button from "../../UI/Buttons/Button";
import Input from "../../UI/Inputs/Input";
import EmptyLi from "../../UI/Lists/EmptyLi";
import LoadingLi from "../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import FakeWindow from "../../UI/Windows/FakeWindow";
import CalvinAITemplateEdit from "./CalvinAITemplateEdit";
import CalvinAITemplateForm from "./CalvinAITemplateForm";
import CalvinAITemplateItem from "./CalvinAITemplateItem";

type CalvinAITemplatesProps = {
  handleSelectTemplate: (template: CalvinAITemplateType) => void;
};

const CalvinAITemplates = ({
  handleSelectTemplate,
}: CalvinAITemplatesProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [editTemplateVisible, setEditTemplateVisible] = useState(false);
  const [newTemplateVisible, setNewTemplateVisible] = useState(false);
  const [templateToEditId, setTemplateToEditId] = useState<
    number | undefined
  >();
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
  } = useCalvinAITemplates(debouncedSearch);

  const {
    data: favoritesTemplates,
    isPending: isPendingFavorites,
    error: errorFavorites,
  } = useCalvinAIFavoritesTemplates(user.id, debouncedSearch);

  //Intersection observer
  const { rootRef, targetRef } = useIntersection<HTMLDivElement | null>(
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
        <Button onClick={handleAddNew} label="Add a new template" />
      </div>
      <div className="templates__search">
        <Input
          value={search}
          onChange={handleSearch}
          id="template-search"
          label="Search"
          placeholder="Template name, author name"
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
                <CalvinAITemplateItem
                  template={template}
                  handleSelectTemplate={handleSelectTemplate}
                  handleEdit={handleEdit}
                  key={template.id}
                  targetRef={targetRef}
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
          color="#8fb4fb"
          setPopUpVisible={setNewTemplateVisible}
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
          color="#8fb4fb"
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

export default CalvinAITemplates;
