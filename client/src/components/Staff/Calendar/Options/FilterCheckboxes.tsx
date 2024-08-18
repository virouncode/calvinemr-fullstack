import React, { useState } from "react";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import { StaffType } from "../../../../types/api";
import { RemainingStaffType } from "../../../../types/app";
import { splitStaffInfos } from "../../../../utils/appointments/splitStaffInfos";
import { categoryToTitle } from "../../../../utils/names/categoryToTitle";
import FilterCheckboxesSection from "./FilterCheckboxesSection";

type FilterCheckboxesProps = {
  hostsIds: number[];
  setHostsIds: React.Dispatch<React.SetStateAction<number[]>>;
  remainingStaff: RemainingStaffType[];
};

const FilterCheckboxes = ({
  hostsIds,
  setHostsIds,
  remainingStaff,
}: FilterCheckboxesProps) => {
  const { staffInfos } = useStaffInfosContext();
  const activeStaff: StaffType[] = staffInfos.filter(
    ({ account_status }) => account_status !== "Closed"
  );
  const [categories, setCategories] = useState<string[]>([]);
  const categoriesInfos = splitStaffInfos(staffInfos);

  const isChecked = (id: number) => hostsIds.includes(id);
  const isCategoryChecked = (category: string) => categories.includes(category);

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = parseInt(e.target.id);
    const checked = e.target.checked;
    const category = e.target.name;

    const categoryContactsIds = activeStaff
      .filter(({ title }) => title === categoryToTitle(category))
      .map(({ id }) => id);
    if (checked) {
      setHostsIds([...hostsIds, id]);
      if (
        [...hostsIds, id].filter((id) => categoryContactsIds.includes(id))
          .length === categoryContactsIds.length
      )
        setCategories([...categories, category]);
    } else {
      setHostsIds(hostsIds.filter((recipientId) => recipientId !== id));
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
      const recipientsIdsUpdated = [...hostsIds];
      categoryContactsIds.forEach((id) => {
        if (!recipientsIdsUpdated.includes(id)) {
          recipientsIdsUpdated.push(id);
        }
      });
      setHostsIds(recipientsIdsUpdated);
    } else {
      setCategories(categories.filter((cat) => cat !== category));
      setHostsIds(hostsIds.filter((id) => !categoryContactsIds.includes(id)));
    }
  };

  return (
    <form className="filter-checkboxes">
      {categoriesInfos
        .filter((category) => category.infos.length !== 0)
        .map((category) => (
          <div className="filter-checkboxes-section" key={category.name}>
            <FilterCheckboxesSection
              isChecked={isChecked}
              handleCheck={handleCheck}
              isCategoryChecked={isCategoryChecked}
              handleCheckCategory={handleCheckCategory}
              categoryInfos={category.infos}
              categoryName={category.name}
              remainingStaff={remainingStaff}
            />
          </div>
        ))}
    </form>
  );
};

export default FilterCheckboxes;
