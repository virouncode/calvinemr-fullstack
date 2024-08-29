import { Reorder } from "framer-motion";
import React, { useState } from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { usePatientsGroupPost } from "../../../hooks/reactquery/mutations/patientsGroupsMutations";
import { DemographicsType, GroupType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { groupSchema } from "../../../validation/groups/groupValidation";
import CancelButton from "../../UI/Buttons/CancelButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import UserPlusIcon from "../../UI/Icons/UserPlusIcon";
import Input from "../../UI/Inputs/Input";
import EmptyLi from "../../UI/Lists/EmptyLi";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import FakeWindow from "../../UI/Windows/FakeWindow";
import PatientChartHealthSearch from "../Billing/PatientChartHealthSearch";
import ColorPicker from "./ColorPicker";
import PatientsGroupEditPatientItem from "./PatientsGroupEditPatientItem";
import PatientsGroupTypeRadio from "./PatientsGroupTypeRadio";

type PatientsGroupFormProps = {
  setAddGroupVisible: React.Dispatch<React.SetStateAction<boolean>>;
  global: boolean;
};

const PatientsGroupForm = ({
  setAddGroupVisible,
  global,
}: PatientsGroupFormProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const [groupInfos, setGroupInfos] = useState<Partial<GroupType>>({
    name: "",
    description: "",
    color: "#6492d8",
    patients: [],
    staff_id: user.id,
    global,
  });
  const [order, setOrder] = useState<number[]>([]);
  const [addPatientsVisible, setAddPatientsVisible] = useState(false);
  const [progress, setProgress] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  //Queries
  const patientsGroupPost = usePatientsGroupPost(user.id);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setErrMsg("");
    const value = e.target.value;
    const name = e.target.name;
    setGroupInfos({ ...groupInfos, [name]: value });
  };

  const handleChangeType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "true" ? true : false;
    setGroupInfos({ ...groupInfos, global: value });
  };

  const handleClickColor = (color: string) => {
    setGroupInfos({ ...groupInfos, color: color });
  };

  const handleClickPatient = (patient: DemographicsType) => {
    setErrMsg("");
    setGroupInfos({
      ...groupInfos,
      patients: [
        ...(groupInfos.patients as { patient_infos: DemographicsType }[]),
        { patient_infos: patient },
      ],
    });
    setOrder([...order, patient.patient_id]);
  };
  const handleRemovePatient = async (patientIdToRemove: number) => {
    setErrMsg("");
    setOrder(order.filter((item) => item !== patientIdToRemove));
  };
  const handleCancel = () => {
    setAddGroupVisible(false);
  };
  const handleSave = async () => {
    setErrMsg("");
    const datasToPost = {
      ...groupInfos,
      patients: order,
      date_created: nowTZTimestamp(),
    };
    setProgress(true);
    //Validation
    try {
      await groupSchema.validate(datasToPost);
    } catch (err) {
      if (err instanceof Error) setErrMsg(err.message);
      setProgress(false);
      return;
    }
    patientsGroupPost.mutate(datasToPost, {
      onSuccess: () => {
        setAddGroupVisible(false);
      },
      onSettled: () => {
        setProgress(false);
      },
    });
  };

  return (
    <div className="patients-groups__edit">
      {errMsg && <ErrorParagraph errorMsg={errMsg} />}
      <div className="patients-groups__edit-color">
        <label>Color</label>
        <ColorPicker
          handleClickColor={handleClickColor}
          choosenColor={groupInfos.color ?? "#6492d8"}
        />
      </div>
      <div className="patients-groups__edit-name">
        <Input
          value={groupInfos.name ?? ""}
          onChange={handleChange}
          name="name"
          id="name"
          label="Name"
          autoFocus={true}
        />
      </div>
      <div className="patients-groups__edit-description">
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          value={groupInfos.description}
          onChange={handleChange}
          id="description"
        />
      </div>
      <div className="patients-groups__edit-type">
        <label>Type</label>
        <PatientsGroupTypeRadio
          groupInfos={groupInfos}
          handleChangeType={handleChangeType}
        />
      </div>
      <div className="patients-groups__edit-patients">
        <label>
          Patients{" "}
          <UserPlusIcon ml={5} onClick={() => setAddPatientsVisible(true)} />
        </label>
        <Reorder.Group axis="y" values={order} onReorder={setOrder}>
          {order.length > 0 ? (
            order.map((item) => (
              <PatientsGroupEditPatientItem
                patient={(
                  groupInfos.patients as { patient_infos: DemographicsType }[]
                ).find(
                  ({ patient_infos }) => patient_infos.patient_id === item
                )}
                key={item}
                item={item}
                handleRemovePatient={handleRemovePatient}
                order={order}
              />
            ))
          ) : (
            <EmptyLi text="No patients in this group" paddingLateral={5} />
          )}
        </Reorder.Group>
      </div>
      <div className="patients-groups__edit-btns">
        <SaveButton onClick={handleSave} disabled={progress} />
        <CancelButton onClick={handleCancel} disabled={progress} />
      </div>
      {addPatientsVisible && (
        <FakeWindow
          title="ADD A PATIENT TO GROUP"
          width={800}
          height={600}
          x={(window.innerWidth - 800) / 2 + 300}
          y={(window.innerHeight - 600) / 2}
          color={groupInfos.color ?? "#6492d8"}
          setPopUpVisible={setAddPatientsVisible}
        >
          <PatientChartHealthSearch
            handleClickPatient={handleClickPatient}
            patientsIdToRemove={order}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default PatientsGroupForm;
