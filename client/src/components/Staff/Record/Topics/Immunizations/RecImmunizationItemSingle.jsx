import { useState } from "react";
import Checkbox from "../../../../UI/Checkbox/Checkbox";
import FakeWindow from "../../../../UI/Windows/FakeWindow";
import RecImmunizationEdit from "./RecImmunizationEdit";
import RecImmunizationForm from "./RecImmunizationForm";
import RecImmunizationLabel from "./RecImmunizationLabel";

const RecImmunizationItemSingle = ({
  age,
  type,
  route,
  immunizationInfos,
  rangeStart,
  rangeEnd,
  patientId,
  topicPost,
  topicPut,
  topicDelete,
}) => {
  //HOOKS
  const [formVisible, setFormVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");

  //STYLES

  //HANDLERS
  const handleCheck = async (e) => {
    const checked = e.target.checked;
    if (checked) {
      setFormVisible(true);
    } else {
      setEditVisible(true);
    }
  };

  const isChecked = () => {
    return immunizationInfos.Date ? true : false;
  };

  return (
    <div className="recimmunizations-item__cell">
      <Checkbox
        id="recimmunizations-item__checkbox"
        name={type}
        onChange={handleCheck}
        checked={isChecked()}
      />
      <RecImmunizationLabel
        immunizationInfos={immunizationInfos}
        route={route}
        age={age}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
      />
      {formVisible && (
        <FakeWindow
          title={`NEW IMMUNIZATION (${type})`}
          width={700}
          height={650}
          x={(window.innerWidth - 700) / 2}
          y={(window.innerHeight - 650) / 2}
          color="#931621"
          setPopUpVisible={setFormVisible}
        >
          <RecImmunizationForm
            setFormVisible={setFormVisible}
            immunizationInfos={immunizationInfos}
            type={type}
            age={age}
            rangeStart={rangeStart}
            route={route}
            patientId={patientId}
            errMsgPost={errMsgPost}
            setErrMsgPost={setErrMsgPost}
            topicPost={topicPost}
          />
        </FakeWindow>
      )}
      {editVisible && (
        <FakeWindow
          title={`IMMUNIZATION (${type})`}
          width={700}
          height={650}
          x={(window.innerWidth - 700) / 2}
          y={(window.innerHeight - 650) / 2}
          color="#931621"
          setPopUpVisible={setEditVisible}
        >
          <RecImmunizationEdit
            immunizationInfos={immunizationInfos}
            type={type}
            setEditVisible={setEditVisible}
            errMsgPost={errMsgPost}
            setErrMsgPost={setErrMsgPost}
            topicPut={topicPut}
            topicDelete={topicDelete}
          />
        </FakeWindow>
      )}
    </div>
  );
};

export default RecImmunizationItemSingle;
