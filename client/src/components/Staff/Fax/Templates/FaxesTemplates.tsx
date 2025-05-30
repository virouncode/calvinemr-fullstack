import React, { useState } from "react";
import useUserContext from "../../../../hooks/context/useUserContext";
import {
  useFaxesFavoritesTemplates,
  useFaxesTemplates,
} from "../../../../hooks/reactquery/queries/faxesTemplatesQueries";
import useDebounce from "../../../../hooks/useDebounce";
import useIntersection from "../../../../hooks/useIntersection";
import { FaxTemplateType } from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
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
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [newTemplateVisible, setNewTemplateVisible] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const {
    data: templates,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useFaxesTemplates(debouncedSearch);

  const {
    data: favoritesTemplates,
    isPending: isPendingFavorites,
    error: errorFavorites,
  } = useFaxesFavoritesTemplates(user.id, debouncedSearch);

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
          label="Add a new template"
          disabled={newTemplateVisible}
        />
      </div>
      <div className="templates__search">
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
      <div className="templates__list" ref={divRef}>
        <ul>
          {isPending ? (
            <LoadingLi />
          ) : templatesDatas && templatesDatas.length > 0 ? (
            templatesDatas.map((template, index) =>
              index === templatesDatas.length - 1 ? (
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
            color="#8fb4fb"
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
