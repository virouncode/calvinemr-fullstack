
import { NavLink } from "react-router-dom";
import useUserContext from "../../../../../hooks/context/useUserContext";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import CircularProgressMedium from "../../../../UI/Progress/CircularProgressMedium";

const GroupsContent = ({ topicDatas, isPending, error, patientId }) => {
  const { user } = useUserContext();
  if (isPending)
    return (
      <div className="topic-content">
        <CircularProgressMedium />
      </div>
    );
  if (error)
    return (
      <div className="topic-content">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );
  const datas = topicDatas.pages.flatMap((page) => page.items);
  const myGroups = datas
    .filter(({ global }) => !global)
    .filter((item) => item.staff_id === user.id);

  const globalGroups = datas.filter(({ global }) => global);

  return (
    <div className="topic-content">
      {myGroups && myGroups.length > 0 ? (
        <ul>
          <li style={{ fontWeight: "bold" }}>In my groups</li>
          {myGroups.map((item) => (
            <li key={item.id} className="topic-content__item">
              <NavLink
                to={`/staff/groups/${item.id}/${
                  item.global ? "Clinic groups" : "My groups"
                }`}
                style={{ textDecoration: "underline", cursor: "pointer" }}
              >
                - Ranked{" "}
                {item.patients
                  .map(({ patient_infos }) => patient_infos.patient_id)
                  .indexOf(patientId) + 1}{" "}
                in {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      ) : (
        <ul>
          <li style={{ fontWeight: "bold" }}>Not in my patients groups</li>
        </ul>
      )}
      {globalGroups && globalGroups.length > 0 ? (
        <ul style={{ marginTop: "5px" }}>
          <li style={{ fontWeight: "bold" }}>In clinic groups</li>
          {globalGroups.map((item) => (
            <li key={item.id} className="topic-content__item">
              <NavLink
                to={`/staff/groups/${item.id}/${
                  item.global ? "Clinic groups" : "My groups"
                }`}
                style={{ textDecoration: "underline", cursor: "pointer" }}
              >
                - Ranked{" "}
                {item.patients
                  .map(({ patient_infos }) => patient_infos.patient_id)
                  .indexOf(patientId) + 1}{" "}
                in {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      ) : (
        <ul style={{ marginTop: "5px" }}>
          <li style={{ fontWeight: "bold" }}>Not in clinic groups</li>
        </ul>
      )}
    </div>
  );
};

export default GroupsContent;
