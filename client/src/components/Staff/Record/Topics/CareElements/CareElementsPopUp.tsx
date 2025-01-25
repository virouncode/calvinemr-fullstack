import React, { useState } from "react";
import {
  useTopicDelete,
  useTopicPost,
  useTopicPut,
} from "../../../../../hooks/reactquery/mutations/topicMutations";
import { useTopic } from "../../../../../hooks/reactquery/queries/topicQueries";
import {
  CareElementAdditionalType,
  CareElementGraphDataType,
  CareElementListItemType,
  CareElementType,
} from "../../../../../types/api";
import Button from "../../../../UI/Buttons/Button";
import CloseButton from "../../../../UI/Buttons/CloseButton";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import CareElementAdditionalEdit from "./Additional/CareElementAdditionalEdit";
import CareElementAdditionalForm from "./Additional/CareElementAdditionalForm";
import CareElementAdditionalItem from "./Additional/CareElementAdditionalItem";
import NewCareElementItemForm from "./Additional/NewCareElementItemForm";
import CareElementGraph from "./CareElementGraph";
import CareElementGraphAdditional from "./CareElementGraphAdditional";
import CareElementItem from "./CareElementItem";
import { careElementsList } from "./careElementsList";
import CareElementEdit from "./Edit/CareElementEdit";
import CareElementEditBloodPressure from "./Edit/CareElementEditBloodPressure";
import CareElementEditMeasurements from "./Edit/CareElementEditMeasurements";
import CareElementEditSmoking from "./Edit/CareElementEditSmoking";
import CareElementForm from "./Form/CareElementForm";
import CareElementFormBloodPressure from "./Form/CareElementFormBloodPressure";
import CareElementFormMeasurements from "./Form/CareElementFormMeasurements";
import CareElementFormSmoking from "./Form/CareElementFormSmoking";

type CareElementsPopUpProps = {
  patientId: number;
  patientName: string;
  setPopUpVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const CareElementsPopUp = ({
  patientId,
  patientName,
  setPopUpVisible,
}: CareElementsPopUpProps) => {
  const [addItemVisible, setAddItemVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [addAdditionalVisible, setAddAdditionalVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editAdditionalVisible, setEditAdditionalVisible] = useState(false);
  const [graphVisible, setGraphVisible] = useState(false);
  const [graphAdditionalVisible, setGraphAdditionalVisible] = useState(false);
  const [graphTopic, setGraphTopic] = useState("");
  const [graphData, setGraphData] = useState<
    CareElementGraphDataType[] | CareElementGraphDataType[][]
  >([]);
  const [graphAdditionalData, setGraphAdditionalData] =
    useState<CareElementAdditionalType>();
  const [graphUnit, setGraphUnit] = useState<string | string[]>("");
  const [careElementToShow, setCareElementToShow] =
    useState<CareElementListItemType>({
      name: "",
      key: "SmokingStatus",
      valueKey: "",
      unit: "",
      unitKey: "",
    });
  const [careElementToAdd, setCareElementToAdd] =
    useState<CareElementListItemType>({
      name: "",
      key: "SmokingStatus",
      valueKey: "",
      unit: "",
      unitKey: "",
    });
  const [careElementToEdit, setCareElementToEdit] =
    useState<CareElementListItemType>({
      name: "",
      key: "SmokingStatus",
      valueKey: "",
      unit: "",
      unitKey: "",
    });
  const [careElementAdditionalToAdd, setCareElementAdditionalToAdd] = useState<{
    Name: string;
    Unit: string;
  }>({
    Name: "",
    Unit: "",
  });
  const [careElementAdditionalToEdit, setCareElementAdditionalToEdit] =
    useState<{
      Name: string;
      Unit: string;
    }>({
      Name: "",
      Unit: "",
    });
  const {
    data: topicDatas,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useTopic("CARE ELEMENTS", patientId);
  const topicPost = useTopicPost("CARE ELEMENTS", patientId);
  const topicPut = useTopicPut("CARE ELEMENTS", patientId);
  const topicDelete = useTopicDelete("CARE ELEMENTS", patientId);

  if (isPending) {
    return (
      <div className="care-elements">
        <h1 className="care-elements__title">Patient care elements</h1>
        <LoadingParagraph />
      </div>
    );
  }
  if (error) {
    return (
      <div className="care-elements">
        <h1 className="care-elements__title">Patient care elements</h1>
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  }
  const datas = topicDatas?.pages?.flatMap((page) => page.items)[0];
  const additionalDatas: CareElementAdditionalType[] = datas?.Additional ?? [];

  const handleClose = () => {
    setPopUpVisible(false);
  };
  const handleAddItem = () => {
    setAddItemVisible(true);
  };

  return (
    <div className="care-elements">
      <h1 className="care-elements__title">Patient care elements</h1>
      <div className="care-elements__table-container">
        <table className="care-elements__table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Item</th>
              <th>Last result</th>
              <th>Date of last result</th>
            </tr>
          </thead>
          <tbody>
            {careElementsList?.map((careElement) => (
              <CareElementItem
                key={careElement.name}
                careElementsDatas={datas}
                careElement={careElement}
                setAddVisible={setAddVisible}
                setGraphVisible={setGraphVisible}
                setEditVisible={setEditVisible}
                setGraphTopic={setGraphTopic}
                setGraphData={setGraphData}
                setGraphUnit={setGraphUnit}
                setCareElementToShow={setCareElementToShow}
                setCareElementToAdd={setCareElementToAdd}
                setCareElementToEdit={setCareElementToEdit}
                results={datas?.[careElement.key] ?? []}
              />
            ))}
            {additionalDatas.map((additionalData) => (
              <CareElementAdditionalItem
                key={additionalData.Name}
                results={additionalData}
                setGraphAdditionalVisible={setGraphAdditionalVisible}
                setGraphAdditionalData={setGraphAdditionalData}
                setCareElementAdditionalToAdd={setCareElementAdditionalToAdd}
                setAddAdditionalVisible={setAddAdditionalVisible}
                setEditAdditionalVisible={setEditAdditionalVisible}
                setCareElementAdditionalToEdit={setCareElementAdditionalToEdit}
                careElementsDatas={datas as CareElementType}
                topicPut={topicPut}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="care-elements__btn-container">
        <Button onClick={handleAddItem} label="Add new item" />
        <CloseButton onClick={handleClose} />
      </div>
      {addVisible && (
        <FakeWindow
          title={`ADD ${
            careElementToAdd.key === "BloodPressure"
              ? "Blood Pressure (mmHg)"
              : careElementToAdd.name
          } RESULT`}
          width={800}
          height={270}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 270) / 2}
          color="#577399"
          setPopUpVisible={setAddVisible}
        >
          {careElementToAdd.key === "SmokingStatus" ||
          careElementToAdd.key === "SmokingPacks" ? (
            <CareElementFormSmoking
              setAddVisible={setAddVisible}
              careElementToAdd={careElementToAdd}
              careElementsDatas={datas}
              patientId={patientId}
              topicPost={topicPost}
              topicPut={topicPut}
            />
          ) : careElementToAdd.key === "BloodPressure" ? (
            <CareElementFormBloodPressure
              setAddVisible={setAddVisible}
              careElementToAdd={careElementToAdd}
              careElementsDatas={datas}
              patientId={patientId}
              topicPost={topicPost}
              topicPut={topicPut}
            />
          ) : careElementToAdd.key === "Weight" ||
            careElementToAdd.key === "Height" ? (
            <CareElementFormMeasurements
              setAddVisible={setAddVisible}
              careElementsDatas={datas}
              patientId={patientId}
              topicPost={topicPost}
              topicPut={topicPut}
            />
          ) : (
            <CareElementForm
              setAddVisible={setAddVisible}
              careElementToAdd={careElementToAdd}
              careElementsDatas={datas}
              patientId={patientId}
              topicPost={topicPost}
              topicPut={topicPut}
            />
          )}
        </FakeWindow>
      )}
      {addAdditionalVisible && (
        <FakeWindow
          title={`ADD ${
            careElementToAdd.key === "BloodPressure"
              ? "Blood Pressure (mmHg)"
              : careElementToAdd.name
          } RESULT`}
          width={800}
          height={270}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 270) / 2}
          color="#577399"
          setPopUpVisible={setAddVisible}
        >
          <CareElementAdditionalForm
            setAddAdditionalVisible={setAddAdditionalVisible}
            careElementAdditionalToAdd={careElementAdditionalToAdd}
            careElementsDatas={datas}
            patientId={patientId}
            topicPost={topicPost}
            topicPut={topicPut}
          />
        </FakeWindow>
      )}
      {graphVisible && (
        <FakeWindow
          title={`${graphTopic} HISTORY of ${patientName}`}
          width={800}
          height={600}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#577399"
          setPopUpVisible={setGraphVisible}
        >
          <CareElementGraph
            graphTopic={graphTopic}
            graphData={graphData}
            graphUnit={graphUnit}
            careElementToShow={careElementToShow}
          />
        </FakeWindow>
      )}
      {graphAdditionalVisible && (
        <FakeWindow
          title={`${graphAdditionalData?.Name} HISTORY of ${patientName}`}
          width={800}
          height={600}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#577399"
          setPopUpVisible={setGraphAdditionalVisible}
        >
          <CareElementGraphAdditional
            graphAdditionalData={graphAdditionalData}
          />
        </FakeWindow>
      )}
      {editVisible && (
        <FakeWindow
          title={`EDIT ${
            careElementToEdit.key === "BloodPressure"
              ? "Blood Pressure (mmHg)"
              : careElementToEdit.name
          }`}
          width={800}
          height={500}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 500) / 2}
          color="#577399"
          setPopUpVisible={setEditVisible}
        >
          {careElementToEdit.key === "SmokingStatus" ||
          careElementToEdit.key === "SmokingPacks" ? (
            <CareElementEditSmoking
              setEditVisible={setEditVisible}
              careElementsDatas={datas}
              topicPut={topicPut}
            />
          ) : careElementToEdit.key === "BloodPressure" ? (
            <CareElementEditBloodPressure
              setEditVisible={setEditVisible}
              careElementsDatas={datas}
              topicPut={topicPut}
            />
          ) : careElementToEdit.key === "Weight" ||
            careElementToEdit.key === "Height" ? (
            <CareElementEditMeasurements
              setEditVisible={setEditVisible}
              careElementsDatas={datas}
              topicPut={topicPut}
            />
          ) : (
            <CareElementEdit
              setEditVisible={setEditVisible}
              careElementToEdit={careElementToEdit}
              careElementsDatas={datas}
              topicPut={topicPut}
            />
          )}
        </FakeWindow>
      )}
      {editAdditionalVisible && (
        <FakeWindow
          title={`EDIT ${careElementAdditionalToEdit.Name} ${
            careElementAdditionalToEdit.Unit
              ? `(${careElementAdditionalToEdit.Unit})`
              : ""
          }`}
          width={800}
          height={500}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 500) / 2}
          color="#577399"
          setPopUpVisible={setEditAdditionalVisible}
        >
          <CareElementAdditionalEdit
            setEditAdditionalVisible={setEditAdditionalVisible}
            careElementAdditionalToEdit={careElementAdditionalToEdit}
            careElementsDatas={datas}
            topicPut={topicPut}
          />
        </FakeWindow>
      )}
      {addItemVisible && (
        <FakeWindow
          title="ADD NEW CARE ELEMENTS ITEM"
          width={800}
          height={270}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 270) / 2}
          color="#577399"
          setPopUpVisible={setAddItemVisible}
        >
          <NewCareElementItemForm
            careElementsDatas={datas}
            setAddItemVisible={setAddItemVisible}
            topicPut={topicPut}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default CareElementsPopUp;
