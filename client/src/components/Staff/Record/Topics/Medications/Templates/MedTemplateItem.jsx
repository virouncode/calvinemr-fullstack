import { Tooltip } from "@mui/material";
import { useState } from "react";

import useStaffInfosContext from "../../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../../hooks/context/useUserContext";
import {
  useMedsTemplateDelete,
  useMedsTemplatePost,
} from "../../../../../../hooks/reactquery/mutations/medsTemplatesMutations";
import { nowTZTimestamp } from "../../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../../utils/names/staffIdToTitleAndName";
import { confirmAlert } from "../../../../../All/Confirm/ConfirmGlobal";
import FakeWindow from "../../../../../UI/Windows/FakeWindow";
import MedTemplateEdit from "./MedTemplateEdit";

const MedTemplateItem = ({ med, handleSelectTemplate, lastItemRef = null }) => {
  const { staffInfos } = useStaffInfosContext();
  const { user } = useUserContext();
  const [editVisible, setEditVisible] = useState(false);
  const medTemplatePost = useMedsTemplatePost();
  const medTemplateDelete = useMedsTemplateDelete();

  const handleEdit = () => {
    setEditVisible(true);
  };

  const handleDuplicate = async () => {
    const templateToPost = {
      ...med,
      date_created: nowTZTimestamp(),
      author_id: user.id,
    };
    medTemplatePost.mutate(templateToPost);
  };

  const handleDelete = async (e, medId) => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this template ?",
      })
    ) {
      medTemplateDelete.mutate(medId);
    }
  };

  return (
    <>
      <li className="med-templates__item" ref={lastItemRef}>
        <Tooltip title={"Add to RX"} placement="top-start" arrow>
          <span
            onClick={(e) => handleSelectTemplate(e, med)}
            style={{ whiteSpace: "pre" }}
          >
            - {med.PrescriptionInstructions}{" "}
            {med.author_id
              ? `(${staffIdToTitleAndName(staffInfos, med.author_id)})`
              : ""}
          </span>
        </Tooltip>
        {med.author_id === user.id && (
          <i
            className="fa-regular fa-pen-to-square"
            style={{ marginLeft: "5px" }}
            onClick={handleEdit}
          ></i>
        )}
        <Tooltip title="Duplicate" placement="top-start" arrow>
          <i
            className="fa-solid fa-clone"
            style={{ marginLeft: "5px" }}
            onClick={handleDuplicate}
          ></i>
        </Tooltip>
        {med.author_id === user.id && (
          <i
            className="fa-solid fa-trash"
            style={{ marginLeft: "5px" }}
            onClick={(e) => handleDelete(e, med.id)}
          ></i>
        )}
      </li>
      {editVisible && (
        <FakeWindow
          title="EDIT MEDICATION TEMPLATE"
          width={600}
          height={750}
          x={(window.innerWidth - 600) / 2}
          y={(window.innerHeight - 750) / 2}
          color="#931621"
          setPopUpVisible={setEditVisible}
        >
          <MedTemplateEdit setEditVisible={setEditVisible} med={med} />
        </FakeWindow>
      )}
    </>
  );
};

export default MedTemplateItem;
