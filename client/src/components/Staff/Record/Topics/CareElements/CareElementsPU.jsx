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

  // const lastDatas = datas
  //   ? {
  //       patient_id: parseInt(patientId),
  //       SmokingStatus: datas.SmokingStatus?.sort(
  //         (a, b) => b.Date - a.Date
  //       )?.[0] || { Status: "", Date: "" },
  //       SmokingPacks: datas.SmokingPacks?.sort(
  //         (a, b) => b.Date - a.Date
  //       )?.[0] || { PerDay: "", Date: "" },
  //       Weight: datas.Weight?.sort((a, b) => b.Date - a.Date)?.[0] || {
  //         Weight: "",
  //         WeightUnit: "kg",
  //         Date: "",
  //       },
  //       Height: datas.Height?.sort((a, b) => b.Date - a.Date)?.[0] || {
  //         Height: "",
  //         HeightUnit: "cm",
  //         Date: "",
  //       },
  //       WaistCircumference: datas.WaistCircumference?.sort(
  //         (a, b) => b.Date - a.Date
  //       )?.[0] || {
  //         WaistCircumference: "",
  //         WaistCircumferenceUnit: "cm",
  //         Date: "",
  //       },
  //       BloodPressure: datas.BloodPressure?.sort(
  //         (a, b) => b.Date - a.Date
  //       )?.[0] || {
  //         SystolicBP: "",
  //         DiastolicBP: "",
  //         BPUnit: "mmHg",
  //         Date: "",
  //       },
  //       bodyMassIndex: datas.bodyMassIndex?.sort(
  //         (a, b) => b.Date - a.Date
  //       )?.[0] || { BMI: "", Date: "" },
  //       bodySurfaceArea: datas.bodySurfaceArea?.sort(
  //         (a, b) => b.Date - a.Date
  //       )?.[0] || { BSA: "", Date: "" },
  //     }
  //   : {
  //       patient_id: parseInt(patientId),
  //       SmokingStatus: { Status: "", Date: "" },
  //       SmokingPacks: { PerDay: "", Date: "" },
  //       Weight: { Weight: "", WeightUnit: "kg", Date: "" },
  //       Height: { Height: "", HeightUnit: "cm", Date: "" },
  //       WaistCircumference: {
  //         WaistCircumference: "",
  //         WaistCircumferenceUnit: "cm",
  //         Date: "",
  //       },
  //       BloodPressure: {
  //         SystolicBP: "",
  //         DiastolicBP: "",
  //         BPUnit: "mmHg",
  //         Date: "",
  //       },
  //       bodyMassIndex: { BMI: "", Date: "" },
  //       bodySurfaceArea: { BSA: "", Date: "" },
  //     };

  // return (
  //   <>
  //     <h1 className="care-elements__title">
  //       Patient care elements <i className="fa-solid fa-ruler-combined"></i>
  //     </h1>
  //     {errMsgPost && <div className="care-elements__err">{errMsgPost}</div>}

  //     <div
  //       className="care-elements__card"
  //       style={{ border: errMsgPost && "solid 1.5px red" }}
  //     >
  //       <div className="care-elements__card-title">
  //         <span>{addVisible ? "New care elements" : "Last information"}</span>
  //         <div className="care-elements__btn-container">
  //           {!addVisible ? (
  //             <>
  //               <button onClick={handleAdd} disabled={progress}>
  //                 Add
  //               </button>
  //               <button onClick={handleClose} disabled={progress}>
  //                 Close
  //               </button>
  //             </>
  //           ) : (
  //             <>
  //               <button
  //                 onClick={handleSubmit}
  //                 disabled={progress}
  //                 className="save-btn"
  //               >
  //                 Save
  //               </button>
  //               <button
  //                 type="button"
  //                 onClick={handleCancel}
  //                 disabled={progress}
  //               >
  //                 Cancel
  //               </button>
  //             </>
  //           )}
  //         </div>
  //       </div>
  //       <div className="care-elements__card-content">
  //         {addVisible && (
  //           <div className="care-elements__row">
  //             <label className="care-elements__row-label">Date:</label>
  //             <div className="care-elements__row-value care-elements__row-value--add">
  //               <input type="date" onChange={handleDateChange} value={date} />
  //             </div>
  //           </div>
  //         )}
  //         <CareElementsSmoking
  //           formDatas={formDatas}
  //           setFormDatas={setFormDatas}
  //           lastDatas={lastDatas}
  //           date={date}
  //           addVisible={addVisible}
  //           handleClickHistory={handleClickHistory}
  //         />
  //         <CareElementsPacks
  //           formDatas={formDatas}
  //           setFormDatas={setFormDatas}
  //           lastDatas={lastDatas}
  //           date={date}
  //           addVisible={addVisible}
  //           handleClickHistory={handleClickHistory}
  //         />
  //         <CareElementsWeight
  //           formDatas={formDatas}
  //           setFormDatas={setFormDatas}
  //           lastDatas={lastDatas}
  //           date={date}
  //           addVisible={addVisible}
  //           handleClickHistory={handleClickHistory}
  //         />
  //         <CareElementsWeightLbs
  //           formDatas={formDatas}
  //           setFormDatas={setFormDatas}
  //           lastDatas={lastDatas}
  //           date={date}
  //           addVisible={addVisible}
  //           handleClickHistory={handleClickHistory}
  //         />
  //         <CareElementsHeight
  //           formDatas={formDatas}
  //           setFormDatas={setFormDatas}
  //           lastDatas={lastDatas}
  //           date={date}
  //           addVisible={addVisible}
  //           handleClickHistory={handleClickHistory}
  //           heightDatas={
  //             datas?.Height?.length
  //               ? datas?.Height.sort((a, b) => a.Date - b.Date)
  //               : []
  //           }
  //           weightDatas={
  //             datas?.Weight?.length
  //               ? datas?.Weight.sort((a, b) => a.Date - b.Date)
  //               : []
  //           }
  //           bmiDatas={
  //             datas?.bodyMassIndex?.length
  //               ? datas?.bodyMassIndex.sort((a, b) => a.Date - b.Date)
  //               : []
  //           }
  //           bsaDatas={
  //             datas?.bodySurfaceArea?.length
  //               ? datas?.bodySurfaceArea.sort((a, b) => a.Date - b.Date)
  //               : []
  //           }
  //           handleSaveEditHeight={handleSaveEditHeight}
  //         />
  //         <CareElementsHeightFeet
  //           formDatas={formDatas}
  //           setFormDatas={setFormDatas}
  //           lastDatas={lastDatas}
  //           date={date}
  //           addVisible={addVisible}
  //           handleClickHistory={handleClickHistory}
  //         />
  //         <CareElementsBMI
  //           formDatas={formDatas}
  //           lastDatas={lastDatas}
  //           addVisible={addVisible}
  //           handleClickHistory={handleClickHistory}
  //         />
  //         <CareElementsBSA
  //           formDatas={formDatas}
  //           lastDatas={lastDatas}
  //           addVisible={addVisible}
  //           handleClickHistory={handleClickHistory}
  //         />
  //         <CareElementsWaist
  //           formDatas={formDatas}
  //           setFormDatas={setFormDatas}
  //           lastDatas={lastDatas}
  //           waistDatas={
  //             datas?.WaistCircumference?.length
  //               ? datas?.WaistCircumference.sort((a, b) => a.Date - b.Date)
  //               : []
  //           }
  //           date={date}
  //           addVisible={addVisible}
  //           handleClickHistory={handleClickHistory}
  //           handleSaveEdit={handleSaveEdit}
  //         />
  //         <CareElementsSystolic
  //           formDatas={formDatas}
  //           setFormDatas={setFormDatas}
  //           lastDatas={lastDatas}
  //           date={date}
  //           addVisible={addVisible}
  //           handleClickHistory={handleClickHistory}
  //         />
  //         <CareElementsDiastolic
  //           formDatas={formDatas}
  //           setFormDatas={setFormDatas}
  //           lastDatas={lastDatas}
  //           date={date}
  //           addVisible={addVisible}
  //           handleClickHistory={handleClickHistory}
  //         />
  //       </div>
  //       <p className="care-elements__sign">
  //         {datas && isUpdated(datas) ? (
  //           <em>
  //             Updated by{" "}
  //             {staffIdToTitleAndName(
  //               staffInfos,
  //               getLastUpdate(datas).updated_by_id
  //             )}{" "}
  //             on{" "}
  //             {timestampToDateTimeSecondsStrTZ(
  //               getLastUpdate(datas).date_updated
  //             )}
  //           </em>
  //         ) : (
  //           datas && (
  //             <em>
  //               Created by{" "}
  //               {staffIdToTitleAndName(staffInfos, datas.created_by_id)} on{" "}
  //               {timestampToDateTimeSecondsStrTZ(datas.date_created)}
  //             </em>
  //           )
  //         )}
  //       </p>
  //     </div>
  //     {historyVisible && (
  //       <FakeWindow
  //         title={`${historyTopic} HISTORY of ${patientName}`}
  //         width={800}
  //         height={600}
  //         x={(window.innerWidth - 800) / 2}
  //         y={(window.innerHeight - 600) / 2}
  //         color="#577399"
  //         setPopUpVisible={setHistoryVisible}
  //       >
  //         <CareElementHistory
  //           historyTopic={historyTopic}
  //           historyDatas={historyDatas}
  //           historyUnit={historyUnit}
  //         />
  //       </FakeWindow>
  //     )}
  //   </>
  // );
};

export default CareElementsPU;
