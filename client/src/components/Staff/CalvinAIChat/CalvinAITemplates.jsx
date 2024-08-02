import { useState } from "react";

import { useCalvinAITemplates } from "../../../hooks/reactquery/queries/calvinaiTemplatesQueries";
import useIntersection from "../../../hooks/useIntersection";
import EmptyLi from "../../UI/Lists/EmptyLi";
import LoadingLi from "../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import FakeWindow from "../../UI/Windows/FakeWindow";
import CalvinAITemplateEdit from "./CalvinAITemplateEdit";
import CalvinAITemplateForm from "./CalvinAITemplateForm";
import CalvinAITemplateItem from "./CalvinAITemplateItem";

const CalvinAITemplates = ({ handleSelectTemplate }) => {
  const [editTemplateVisible, setEditTemplateVisible] = useState(false);
  const [newTemplateVisible, setNewTemplateVisible] = useState(false);
  const [templateToEditId, setTemplateToEditId] = useState();
  const [search, setSearch] = useState("");
  const {
    data: templates,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useCalvinAITemplates(search);

  const { rootRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  const handleEdit = (e, templateId) => {
    setTemplateToEditId(templateId);
    setEditTemplateVisible(true);
  };
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const handleAddNew = (e) => {
    e.preventDefault();
    setNewTemplateVisible((v) => !v);
  };

  if (error) {
    return (
      <div className="calvinai__templates">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  }

  const templatesDatas = templates?.pages.flatMap((page) => page.items);

  return (
    <div className="calvinai__templates">
      <div className="calvinai__templates-btn-container">
        <button onClick={handleAddNew}>Add a new template</button>
      </div>
      <div className="calvinai__templates-search">
        <label htmlFor="template-search">Search</label>
        <input
          id="template-search"
          type="text"
          value={search}
          onChange={handleSearch}
          autoComplete="off"
          placeholder="Template name, author name"
        />
      </div>
      <div className="calvinai__templates-list" ref={rootRef}>
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
                  lastItemRef={lastItemRef}
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
          color="#93b5e9"
          setPopUpVisible={setNewTemplateVisible}
          closeCross={false}
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
          color="#93b5e9"
          setPopUpVisible={setEditTemplateVisible}
        >
          <CalvinAITemplateEdit
            setEditTemplateVisible={setEditTemplateVisible}
            templateToEdit={templatesDatas.find(
              ({ id }) => id === templateToEditId
            )}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default CalvinAITemplates;
