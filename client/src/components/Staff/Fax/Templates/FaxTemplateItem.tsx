import React, { useState } from "react";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import {
  useFaxTemplateDelete,
  useFaxTemplatePost,
  useFaxTemplatePut,
} from "../../../../hooks/reactquery/mutations/faxesTemplatesMutations";
import { FaxTemplateType } from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import { nowTZTimestamp } from "../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import { confirmAlert } from "../../../UI/Confirm/ConfirmGlobal";
import CloneIcon from "../../../UI/Icons/CloneIcon";
import HeartIcon from "../../../UI/Icons/HeartIcon";
import PenIcon from "../../../UI/Icons/PenIcon";
import TrashIcon from "../../../UI/Icons/TrashIcon";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import FaxTemplateEdit from "./FaxTemplateEdit";

type FaxTemplateItemProps = {
  template: FaxTemplateType;
  handleSelectTemplate: (template: FaxTemplateType) => void;
  lastItemRef?: (node: Element | null) => void;
};

const FaxTemplateItem = ({
  template,
  handleSelectTemplate,
  lastItemRef,
}: FaxTemplateItemProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  const [editTemplateVisible, setEditTemplateVisible] = useState(false);
  //Queries
  const templatePost = useFaxTemplatePost();
  const templateDelete = useFaxTemplateDelete();
  const templatePut = useFaxTemplatePut();

  const handleEditClick = () => {
    setEditTemplateVisible(true);
  };

  const handleDelete = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to delete this template ?",
      })
    ) {
      templateDelete.mutate(template.id, {
        onSuccess: () => {
          setEditTemplateVisible(false);
        },
      });
    }
  };

  const handleDuplicate = async (template: FaxTemplateType) => {
    const faxTemplateToPost: FaxTemplateType = {
      ...template,
      author_id: user.id,
      date_created: nowTZTimestamp(),
    };
    templatePost.mutate(faxTemplateToPost);
  };

  const handleLike = async (template: FaxTemplateType) => {
    const templateToPut: FaxTemplateType = {
      ...template,
      favorites_staff_ids: template.favorites_staff_ids.includes(user.id)
        ? template.favorites_staff_ids.filter((id) => id !== user.id)
        : [...template.favorites_staff_ids, user.id],
    };
    templatePut.mutate(templateToPut);
  };

  return (
    <>
      <li className="templates__list-item" key={template.id} ref={lastItemRef}>
        <span onClick={() => handleSelectTemplate(template)}>
          {template.name}{" "}
          {template.author_id
            ? `(
          ${staffIdToTitleAndName(staffInfos, template.author_id)})`
            : ""}
        </span>
        <>
          <CloneIcon onClick={() => handleDuplicate(template)} ml={10} />
          <HeartIcon
            ml={15}
            onClick={() => handleLike(template)}
            active={template.favorites_staff_ids.includes(user.id)}
          />
          {template.author_id === user.id && (
            <PenIcon ml={15} onClick={handleEditClick} />
          )}
          {template.author_id === user.id && (
            <TrashIcon onClick={handleDelete} ml={15} />
          )}
        </>
      </li>
      {editTemplateVisible && (
        <FakeWindow
          title="EDIT MESSAGE EXTERNAL TEMPLATE"
          width={900}
          height={550}
          x={(window.innerWidth - 900) / 2}
          y={(window.innerHeight - 550) / 2}
          color="#8fb4fb"
          setPopUpVisible={setEditTemplateVisible}
        >
          <FaxTemplateEdit
            setEditTemplateVisible={setEditTemplateVisible}
            template={template}
          />
        </FakeWindow>
      )}
    </>
  );
};

export default FaxTemplateItem;
