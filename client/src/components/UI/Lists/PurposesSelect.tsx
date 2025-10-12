import React, { useEffect, useState } from "react";
import usePurposesContext from "../../../hooks/context/usePuposesContext";
import usePurposesCategoriesContext from "../../../hooks/context/usePurposesCategoriesContext";
import { AppointmentType } from "../../../types/api";
import Checkbox from "../Checkbox/Checkbox";

type PurposesSelectProps = {
  formDatas: AppointmentType;
  setFormDatas: React.Dispatch<React.SetStateAction<AppointmentType>>;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
};

const PurposesSelect = ({
  formDatas,
  setFormDatas,
  setErrMsgPost,
}: PurposesSelectProps) => {
  const [open, setOpen] = useState(false);
  const { purposes } = usePurposesContext();
  const { purposesCategories } = usePurposesCategoriesContext();
  const [purposesCheckedIds, setPurposesCheckedIds] = useState<number[]>(
    formDatas.purposes_ids
  );

  useEffect(() => {
    const clickOutsideListener = (event: MouseEvent) => {
      const container = document.getElementById("purposes__select");
      if (container && !container.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", clickOutsideListener);
    return () => {
      document.removeEventListener("mousedown", clickOutsideListener);
    };
  }, []);

  const data: { category: string; purposes: { id: number; name: string }[] }[] =
    [];

  purposesCategories.forEach((category) => {
    const purposesInCategory = purposes
      .filter((purpose) => purpose.category_id === category.id)
      .map(({ id, name }) => ({ id, name }));
    data.push({ category: category.name, purposes: purposesInCategory });
  });

  const handleCheckPurpose = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = parseInt(e.target.id);
    const checked = e.target.checked;
    setErrMsgPost("");
    if (checked) {
      setPurposesCheckedIds([...purposesCheckedIds, id]);
      setFormDatas({
        ...formDatas,
        purposes_ids: [...purposesCheckedIds, id],
      });
    } else {
      setPurposesCheckedIds(
        purposesCheckedIds.filter((purposeId) => purposeId !== id)
      );
      setFormDatas({
        ...formDatas,
        purposes_ids: purposesCheckedIds.filter(
          (purposeId) => purposeId !== id
        ),
      });
    }
  };
  const isPurposeChecked = (id: number) => purposesCheckedIds.includes(id);

  const selectedPurposesNames = purposesCheckedIds.map(
    (id) => purposes.find((purpose) => purpose.id === id)?.name
  );

  return (
    <div className="purposes">
      <label>Purpose</label>

      {open ? (
        <div id="purposes__select" className="purposes__select">
          {data.map((item) => (
            <div key={item.category} className="purposes__select-category">
              <p>{item.category}</p>
              <ul>
                {item.purposes.map((purpose) => (
                  <li key={purpose.id} className="purposes__select-item">
                    <Checkbox
                      id={purpose.id.toString()}
                      name={purpose.name}
                      onChange={handleCheckPurpose}
                      checked={isPurposeChecked(purpose.id)}
                      label={purpose.name}
                      labelSide="right"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="purposes__preview" onClick={() => setOpen(true)}>
          {purposesCheckedIds.length === 0
            ? "Select purpose(s)"
            : selectedPurposesNames.join(" / ")}
        </div>
      )}
    </div>
  );
};

export default PurposesSelect;
