import { Reorder } from "framer-motion";
import { useState } from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { usePatientsGroupPut } from "../../../hooks/reactquery/mutations/patientsGroupsMutations";
import { groupSchema } from "../../../validation/groups/groupValidation";
import CancelButton from "../../UI/Buttons/CancelButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import Input from "../../UI/Inputs/Input";
import EmptyLi from "../../UI/Lists/EmptyLi";
import FakeWindow from "../../UI/Windows/FakeWindow";
import PatientChartHealthSearch from "../Billing/PatientChartHealthSearch";
import ColorPicker from "./ColorPicker";
import PatientsGroupEditPatientItem from "./PatientsGroupEditPatientItem";
import PatientsGroupTypeRadio from "./PatientsGroupTypeRadio";

const PatientsGroupEdit = ({ group, setEditVisible }) => {
  const { user } = useUserContext();
  const [groupInfos, setGroupInfos] = useState(group);
  const [order, setOrder] = useState(
    group.patients.map(({ patient_infos }) => patient_infos.patient_id)
  );
  const [addPatientsVisible, setAddPatientsVisible] = useState(false);
  const [progress, setProgress] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const groupPut = usePatientsGroupPut(user.id);

  const handleChange = (e) => {
    setErrMsg("");
    const value = e.target.value;
    const name = e.target.name;
    setGroupInfos({ ...groupInfos, [name]: value });
  };

  const handleClickColor = (e, color) => {
    setGroupInfos({ ...groupInfos, color: color });
  };

  const handleClickPatient = (e, patient) => {
    setErrMsg("");
    setGroupInfos({
      ...groupInfos,
      patients: [...groupInfos.patients, { patient_infos: patient }],
    });
    setOrder([...order, patient.patient_id]);
  };
  const handleRemovePatient = async (e, patientIdToRemove) => {
    setErrMsg("");
    setOrder(order.filter((item) => item !== patientIdToRemove));
  };
  const handleChangeType = (e) => {
    const value = e.target.value === "true" ? true : false;
    setGroupInfos({ ...groupInfos, global: value });
  };
  const handleCancel = () => {
    setEditVisible(false);
  };
  const handleSave = async () => {
    setErrMsg("");
    const groupToPut = { ...groupInfos, patients: order };

    //Validation
    try {
      await groupSchema.validate(groupToPut);
    } catch (err) {
      setErrMsg(err.message);
      setProgress(false);
      return;
    }
    setProgress(true);
    //Submission
    groupPut.mutate(groupToPut, {
      onSuccess: () => {
        setEditVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };

  return (
    <div className="patients-groups__edit">
      {errMsg && <p className="patients-groups__edit-err">{errMsg}</p>}
      <div className="patients-groups__edit-color">
        <label>Color</label>
        <ColorPicker
          handleClickColor={handleClickColor}
          choosenColor={groupInfos.color}
        />
      </div>
      <div className="patients-groups__edit-name">
        <Input
          value={groupInfos.name}
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
          <i
            className="fa-solid fa-user-plus"
            style={{ marginLeft: "5px", cursor: "pointer" }}
            onClick={() => setAddPatientsVisible(true)}
          />
        </label>
        <Reorder.Group axis="y" values={order} onReorder={setOrder}>
          {order.length > 0 ? (
            order.map((item) => (
              <PatientsGroupEditPatientItem
                patient={groupInfos.patients.find(
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
          color={groupInfos.color}
          setPopUpVisible={setAddPatientsVisible}
          textColor="#3D3759"
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

export default PatientsGroupEdit;
