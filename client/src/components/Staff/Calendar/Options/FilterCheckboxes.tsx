import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoPut from "../../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { SettingsType, StaffType } from "../../../../types/api";
import { RemainingStaffType, UserStaffType } from "../../../../types/app";
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
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const activeStaff: StaffType[] = staffInfos.filter(
    ({ account_status }) => account_status !== "Closed"
  );
  const [categories, setCategories] = useState<string[]>([]);
  const categoriesInfos = splitStaffInfos(staffInfos);

  const isChecked = (id: number) => hostsIds.includes(id);

  const isCategoryChecked = (category: string) => categories.includes(category);

  const handleCheck = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = parseInt(e.target.id);
    const checked = e.target.checked;
    const category = e.target.name;

    const categoryContactsIds = activeStaff
      .filter(({ title }) => title === categoryToTitle(category))
      .map(({ id }) => id);

    let updatedHostsIds: number[];

    if (checked) {
      console.log("checked", id, category);

      updatedHostsIds = [...new Set([...hostsIds, id].filter(Boolean))];
      if (user.title === "Secretary" && !updatedHostsIds.includes(0)) {
        updatedHostsIds = [0, ...updatedHostsIds];
      }

      setHostsIds(updatedHostsIds);
      if (
        [...hostsIds, id].filter((id) => categoryContactsIds.includes(id))
          .length === categoryContactsIds.length
      ) {
        setCategories([...categories, category]);
      }
      try {
        const datasToPut: SettingsType = {
          ...user.settings,
          hosts_ids: [...new Set([...hostsIds, id].filter(Boolean))],
        };
        const response: SettingsType = await xanoPut(
          `/settings/${user.settings.id}`,
          "staff",
          datasToPut
        );
        socket?.emit("message", {
          route: "USER",
          action: "update",
          content: {
            id: user.id,
            data: {
              ...user,
              settings: response,
            },
          },
        });
      } catch (err) {
        if (err instanceof Error)
          toast.error(`Error: unable to save preference: ${err.message}`, {
            containerId: "A",
          });
      }
    } else {
      updatedHostsIds = hostsIds.filter(
        (recipientId) =>
          recipientId !== id &&
          recipientId !== null &&
          recipientId !== undefined
      );
      if (user.title === "Secretary" && !updatedHostsIds.includes(0)) {
        updatedHostsIds = [0, ...updatedHostsIds];
      }
      setHostsIds(updatedHostsIds);
      if (categories.includes(category)) {
        setCategories(categories.filter((name) => name !== category));
      }
      try {
        const datasToPut: SettingsType = {
          ...user.settings,
          hosts_ids: [
            ...new Set(hostsIds.filter((recipientId) => recipientId !== id)),
          ],
        };
        const response: SettingsType = await xanoPut(
          `/settings/${user.settings.id}`,
          "staff",
          datasToPut
        );
        socket?.emit("message", {
          route: "USER",
          action: "update",
          content: {
            id: user.id,
            data: {
              ...user,
              settings: response,
            },
          },
        });
      } catch (err) {
        if (err instanceof Error)
          toast.error(`Error: unable to save preference: ${err.message}`, {
            containerId: "A",
          });
      }
    }
  };

  const handleCheckCategory = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const category = e.target.id;
    const checked = e.target.checked;
    const categoryContactsIds = activeStaff
      .filter(({ title }) => title === categoryToTitle(category))
      .map(({ id }) => id);
    if (checked) {
      setCategories([...categories, category]);
      let recipientsIdsUpdated = [...new Set([...hostsIds].filter(Boolean))];
      categoryContactsIds.forEach((id) => {
        if (!recipientsIdsUpdated.includes(id)) {
          recipientsIdsUpdated.push(id);
        }
      });
      if (user.title === "Secretary" && !recipientsIdsUpdated.includes(0)) {
        recipientsIdsUpdated = [0, ...recipientsIdsUpdated];
      }
      setHostsIds(recipientsIdsUpdated);
      try {
        const datasToPut: SettingsType = {
          ...user.settings,
          hosts_ids: recipientsIdsUpdated.slice(1),
        };
        const response: SettingsType = await xanoPut(
          `/settings/${user.settings.id}`,
          "staff",
          datasToPut
        );
        socket?.emit("message", {
          route: "USER",
          action: "update",
          content: {
            id: user.id,
            data: {
              ...user,
              settings: response,
            },
          },
        });
      } catch (err) {
        if (err instanceof Error)
          toast.error(`Error: unable to save preference: ${err.message}`, {
            containerId: "A",
          });
      }
    } else {
      setCategories(categories.filter((cat) => cat !== category));
      let hostsIdsUpdated = hostsIds.filter(
        (id) => !categoryContactsIds.includes(id)
      );
      if (user.title === "Secretary" && !hostsIdsUpdated.includes(0)) {
        hostsIdsUpdated = [0, ...hostsIdsUpdated];
      }
      setHostsIds(hostsIdsUpdated);
      try {
        const datasToPut: SettingsType = {
          ...user.settings,
          hosts_ids: [
            ...new Set(
              hostsIds.filter((id) => !categoryContactsIds.includes(id))
            ),
          ],
        };
        const response: SettingsType = await xanoPut(
          `/settings/${user.settings.id}`,
          "staff",
          datasToPut
        );
        socket?.emit("message", {
          route: "USER",
          action: "update",
          content: {
            id: user.id,
            data: {
              ...user,
              settings: response,
            },
          },
        });
      } catch (err) {
        if (err instanceof Error)
          toast.error(`Error: unable to save preference: ${err.message}`, {
            containerId: "A",
          });
      }
    }
  };

  return (
    <div className="calendar__staff-checkboxes">
      {categoriesInfos
        .filter((category) => category.infos.length !== 0)
        .map((category) => (
          <ul
            className="calendar__staff-checkboxes-category"
            key={category.name}
          >
            <FilterCheckboxesSection
              isChecked={isChecked}
              handleCheck={handleCheck}
              isCategoryChecked={isCategoryChecked}
              handleCheckCategory={handleCheckCategory}
              categoryInfos={category.infos}
              categoryName={category.name}
              remainingStaff={remainingStaff}
            />
          </ul>
        ))}
    </div>
  );
};

export default FilterCheckboxes;
