import { useState } from "react";
import useIntersection from "../../../../../../hooks/useIntersection";

import EmptyLi from "../../../../../UI/Lists/EmptyLi";

import React from "react";
import useUserContext from "../../../../../../hooks/context/useUserContext";
import {
  useLettersFavoritesTemplates,
  useLettersTemplates,
} from "../../../../../../hooks/reactquery/queries/lettersTemplatesQueries";
import useDebounce from "../../../../../../hooks/useDebounce";
import { LetterTemplateType } from "../../../../../../types/api";
import { UserStaffType } from "../../../../../../types/app";
import Button from "../../../../../UI/Buttons/Button";
import Input from "../../../../../UI/Inputs/Input";
import LoadingLi from "../../../../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../../../../UI/Paragraphs/ErrorParagraph";
import FakeWindow from "../../../../../UI/Windows/FakeWindow";
import LetterTemplateForm from "./LetterTemplateForm";
import LetterTemplateItem from "./LetterTemplateItem";

type LettersTemplatesProps = {
  handleSelectTemplate: (template: LetterTemplateType) => void;
};

const LettersTemplates = ({ handleSelectTemplate }: LettersTemplatesProps) => {
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
  } = useLettersTemplates(debouncedSearch);

  const {
    data: favoritesTemplates,
    isPending: isPendingFavorites,
    error: errorFavorites,
  } = useLettersFavoritesTemplates(user.id, debouncedSearch);

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
          label="Search"
          width={300}
          id="template-search"
          value={search}
          onChange={handleSearch}
          placeholder="Template name, author name,..."
        />
      </div>
      <div className="templates__list" ref={rootRef}>
        <ul>
          {isPending ? (
            <LoadingLi />
          ) : templatesDatas && templatesDatas.length > 0 ? (
            templatesDatas.map((template, index) =>
              index === templatesDatas.length - 1 ? (
                <LetterTemplateItem
                  template={template}
                  handleSelectTemplate={handleSelectTemplate}
                  key={template.id}
                  targetRef={targetRef}
                />
              ) : (
                <LetterTemplateItem
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
            title="NEW LETTER TEMPLATE"
            width={800}
            height={630}
            x={(window.innerWidth - 800) / 2}
            y={(window.innerHeight - 630) / 2}
            color="#848484"
            setPopUpVisible={setNewTemplateVisible}
          >
            <LetterTemplateForm setNewTemplateVisible={setNewTemplateVisible} />
          </FakeWindow>
        )}
      </div>
    </div>
  );
};

export default LettersTemplates;
