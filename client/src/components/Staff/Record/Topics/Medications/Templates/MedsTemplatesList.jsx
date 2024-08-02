import { useState } from "react";
import useIntersection from "../../../../../../hooks/useIntersection";
import EmptyLi from "../../../../../UI/Lists/EmptyLi";
import LoadingLi from "../../../../../UI/Lists/LoadingLi";
import ErrorParagraph from "../../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../../../../UI/Windows/FakeWindow";
import MedTemplateForm from "./MedTemplateForm";
import MedTemplateItem from "./MedTemplateItem";

const MedsTemplatesList = ({
  medsTemplates,
  progress,
  isPendingTemplates,
  errorTemplates,
  isFetchingNextPageTemplates,
  fetchNextPageTemplates,
  isFetchingTemplates,
  search,
  handleSearch,
  allergies,
  handleSelectTemplate,
}) => {
  const [newVisible, setNewVisible] = useState(false);
  const { rootRef, lastItemRef } = useIntersection(
    isFetchingNextPageTemplates,
    fetchNextPageTemplates,
    isFetchingTemplates
  );

  const handleNew = (e) => {
    e.preventDefault();
    setNewVisible(true);
  };

  if (errorTemplates)
    return (
      <div className="med-templates__list">
        <ErrorParagraph errorMsg={errorTemplates.message} />
      </div>
    );

  const medsTemplatesDatas = medsTemplates?.pages.flatMap((page) => page.items);

  return (
    <div className="med-templates__list">
      <div className="medications-form__title">
        <button onClick={handleNew} disabled={progress}>
          Add a new template
        </button>
      </div>
      <div className="med-templates__search">
        <label htmlFor="med-template-search">Search</label>
        <input
          placeholder="Drug name, author name..."
          type="text"
          value={search}
          onChange={handleSearch}
          autoFocus
          autoComplete="off"
          id="med-template-search"
        />
      </div>
      <div className="med-templates__allergies">
        <i
          className="fa-solid fa-triangle-exclamation"
          style={{ color: "#ff0000" }}
        ></i>{" "}
        Patient Allergies :{" "}
        {allergies && allergies.length > 0
          ? allergies
              .map(({ OffendingAgentDescription }) => OffendingAgentDescription)
              .join(", ")
          : "No allergies"}
      </div>
      <ul ref={rootRef}>
        {isPendingTemplates ? (
          <LoadingParagraph />
        ) : medsTemplatesDatas && medsTemplatesDatas.length > 0 ? (
          medsTemplatesDatas.map((med, index) =>
            index === medsTemplatesDatas.length - 1 ? (
              <MedTemplateItem
                med={med}
                key={med.id}
                handleSelectTemplate={handleSelectTemplate}
                lastItemRef={lastItemRef}
              />
            ) : (
              <MedTemplateItem
                med={med}
                key={med.id}
                handleSelectTemplate={handleSelectTemplate}
              />
            )
          )
        ) : (
          !isFetchingNextPageTemplates && <EmptyLi text="No results found" />
        )}
        {isFetchingNextPageTemplates && <LoadingLi />}
      </ul>
      {newVisible && (
        <FakeWindow
          title="NEW MEDICATION TEMPLATE"
          width={600}
          height={750}
          x={(window.innerWidth - 600) / 2}
          y={(window.innerHeight - 750) / 2}
          color="#931621"
          setPopUpVisible={setNewVisible}
        >
          <MedTemplateForm setNewVisible={setNewVisible} />
        </FakeWindow>
      )}
    </div>
  );
};

export default MedsTemplatesList;
