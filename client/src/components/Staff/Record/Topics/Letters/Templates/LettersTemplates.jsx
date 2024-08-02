import { useState } from "react";
import useIntersection from "../../../../../../hooks/useIntersection";

import EmptyLi from "../../../../../UI/Lists/EmptyLi";

import { useLettersTemplates } from "../../../../../../hooks/reactquery/queries/lettersTemplatesQueries";
import LoadingLi from "../../../../../UI/Lists/LoadingLi";
import FakeWindow from "../../../../../UI/Windows/FakeWindow";
import LetterTemplateForm from "./LetterTemplateForm";
import LetterTemplateItem from "./LetterTemplateItem";

const LettersTemplates = ({ handleSelectTemplate }) => {
  const [newTemplateVisible, setNewTemplateVisible] = useState(false);

  const [search, setSearch] = useState("");
  const {
    data: templates,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useLettersTemplates();

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

  const templatesDatas = templates?.pages.flatMap((page) => page.items);

  return (
    <div className="letters__templates">
      <div className="letters__templates-btn-container">
        <button onClick={handleAddNew} disabled={newTemplateVisible}>
          Add a new template
        </button>
      </div>
      <div className="letters__templates-search">
        <label htmlFor="template-search">Search</label>
        <input
          style={{ width: "300px" }}
          id="template-search"
          type="text"
          value={search}
          onChange={handleSearch}
          autoComplete="off"
          placeholder="Template name, author name,..."
        />
      </div>
      <div className="letters__templates-list" ref={rootRef}>
        <ul>
          {error ? (
            <li className="letters__templates__err">{error.message}</li>
          ) : isPending ? (
            <LoadingLi />
          ) : templatesDatas && templatesDatas.length > 0 ? (
            templatesDatas.map((template, index) =>
              index === templatesDatas.length - 1 ? (
                <LetterTemplateItem
                  template={template}
                  handleSelectTemplate={handleSelectTemplate}
                  key={template.id}
                  lastItemRef={lastItemRef}
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
