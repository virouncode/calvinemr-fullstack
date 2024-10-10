import React, { useState } from "react";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import { splitStaffInfos } from "../../../utils/appointments/splitStaffInfos";
import { categoryToTitle } from "../../../utils/names/categoryToTitle";
import Checkbox from "../../UI/Checkbox/Checkbox";
import XmarkRectangleIcon from "../../UI/Icons/XmarkRectangleIcon";
import StaffContactsCategory from "./StaffContactsCategory";

type StaffContactsProps = {
  unfoldedCategory?: string;
  recipientsIds: number[];
  setRecipientsIds: React.Dispatch<React.SetStateAction<number[]>>;
  closeCross?: boolean;
  recipientsRef?: React.MutableRefObject<HTMLDivElement | null>;
};

const StaffContacts = ({
  unfoldedCategory = "",
  recipientsIds,
  setRecipientsIds,
  closeCross,
  recipientsRef,
}: StaffContactsProps) => {
  //Hooks
  const { staffInfos } = useStaffInfosContext();
  const activeStaff = staffInfos.filter(
    ({ account_status }) => account_status !== "Closed"
  );
  const [categories, setCategories] = useState<string[]>([]);
  const categoriesInfos = splitStaffInfos(staffInfos);

  const isContactChecked = (id: number) => recipientsIds.includes(id);
  const isCategoryChecked = (category: string) => categories.includes(category);

  const handleCheckContact = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = parseInt(e.target.id);
    const checked = e.target.checked;
    const category = e.target.name;
    const categoryContactsIds = activeStaff
      .filter(({ title }) => title === categoryToTitle(category))
      .map(({ id }) => id);
    if (checked) {
      setRecipientsIds([...recipientsIds, id]);
      if (
        [...recipientsIds, id].filter((id) => categoryContactsIds.includes(id))
          .length === categoryContactsIds.length
      )
        setCategories([...categories, category]);
    } else {
      setRecipientsIds(
        recipientsIds.filter((recipientId) => recipientId !== id)
      );
      if (categories.includes(category))
        setCategories(categories.filter((name) => name !== category));
    }
  };

  const handleCheckCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const category = e.target.id;
    const checked = e.target.checked;
    const categoryContactsIds = activeStaff
      .filter(({ title }) => title === categoryToTitle(category))
      .map(({ id }) => id);
    if (checked) {
      setCategories([...categories, category]);
      const recipientsIdsUpdated = [...recipientsIds];
      categoryContactsIds.forEach((id) => {
        if (!recipientsIdsUpdated.includes(id)) {
          recipientsIdsUpdated.push(id);
        }
      });
      setRecipientsIds(recipientsIdsUpdated);
    } else {
      setCategories(categories.filter((cat) => cat !== category));
      let recipientsIdsUpdated = [...recipientsIds];
      recipientsIdsUpdated = recipientsIdsUpdated.filter(
        (id) => !categoryContactsIds.includes(id)
      );
      setRecipientsIds(recipientsIdsUpdated);
    }
  };

  const handleClose = () => {
    if (recipientsRef?.current)
      recipientsRef.current.style.transform = "translateX(-200%)";
  };

  const handleCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (checked) {
      setRecipientsIds(activeStaff.map(({ id }) => id));
      setCategories(categoriesInfos.map(({ name }) => name));
    } else {
      setRecipientsIds([]);
      setCategories([]);
    }
  };

  return (
    <div className="contacts">
      <div className="contacts__title">
        Recipients{" "}
        {closeCross && (
          <XmarkRectangleIcon color=" #3d375a" onClick={handleClose} />
        )}
      </div>
      <div className="contacts__list">
        <div className="contacts__list-category">
          <div className="contacts__list-category-overview">
            <Checkbox
              id="all"
              onChange={handleCheckAll}
              checked={recipientsIds.length === activeStaff.length}
              label="All"
            />
          </div>
        </div>
        {categoriesInfos
          .filter((category) => category.infos.length !== 0)
          .map((category) => (
            <StaffContactsCategory
              categoryInfos={category.infos}
              categoryName={category.name}
              handleCheckContact={handleCheckContact}
              isContactChecked={isContactChecked}
              handleCheckCategory={handleCheckCategory}
              isCategoryChecked={isCategoryChecked}
              key={category.name}
              initiallyUnfolded={category.name === unfoldedCategory}
            />
          ))}
      </div>
    </div>
  );
};

export default StaffContacts;
