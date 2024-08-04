import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import CareElementsForm from "./CareElementsForm";
import CareElementsList from "./CareElementsList";

const CareElementsPU = ({
  careElementsDatas,
  careElementPost,
  careElementPut,
  isPending,
  error,
  patientId,
  patientName,
  setPopUpVisible,
}) => {
  if (isPending) {
    return (
      <>
        <h1 className="care-elements__title">
          Patient care elements <i className="fa-solid fa-ruler-combined"></i>
        </h1>
        <LoadingParagraph />
      </>
    );
  }
  if (error) {
    return (
      <>
        <h1 className="care-elements__title">
          Patient care elements <i className="fa-solid fa-ruler-combined"></i>
        </h1>
        <ErrorParagraph errorMsg={error.message} />
      </>
    );
  }

  const datas = careElementsDatas.pages?.flatMap((page) => page.items)[0];

  if (!datas) {
    return (
      <CareElementsForm
        careElementPost={careElementPost}
        setPopUpVisible={setPopUpVisible}
        patientId={patientId}
      />
    );
  } else {
    return (
      <CareElementsList
        careElementPut={careElementPut}
        setPopUpVisible={setPopUpVisible}
        datas={datas}
        patientName={patientName}
      />
    );
  }
};

export default CareElementsPU;
