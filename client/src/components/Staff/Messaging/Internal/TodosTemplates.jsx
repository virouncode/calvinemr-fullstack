import { useState } from "react";
import { useTodosTemplates } from "../../../../hooks/reactquery/queries/messagesTemplatesQueries";
import useIntersection from "../../../../hooks/useIntersection";
import EmptyLi from "../../../UI/Lists/EmptyLi";
import LoadingLi from "../../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../../UI/Paragraphs/ErrorParagraph";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import TodoTemplateForm from "./TodoTemplateForm";
import TodoTemplateItem from "./TodoTemplateItem";

const TodosTemplates = ({ handleSelectTemplate }) => {
  const [newTemplateVisible, setNewTemplateVisible] = useState(false);
  const [search, setSearch] = useState("");

  const {
    data,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useTodosTemplates(search);

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
  const todosTemplates = data?.pages.flatMap((page) => page.items);

  return (
    <div className="messages__templates">
      <div className="messages__templates-btn-container">
        <button onClick={handleAddNew} disabled={newTemplateVisible}>
          Add a new template
        </button>
      </div>
      <div className="messages__templates-search">
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
      <div className="messages__templates-list" ref={rootRef}>
        <ul>
          {isPending ? (
            <LoadingLi />
          ) : todosTemplates && todosTemplates.length > 0 ? (
            todosTemplates.map((template, index) =>
              index === todosTemplates.length - 1 ? (
                <TodoTemplateItem
                  template={template}
                  handleSelectTemplate={handleSelectTemplate}
                  key={template.id}
                  lastItemRef={lastItemRef}
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
            color="#93B5E9"
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
