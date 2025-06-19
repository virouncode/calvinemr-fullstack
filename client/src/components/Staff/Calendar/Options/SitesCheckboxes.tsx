import React from "react";
import { toast } from "react-toastify";
import xanoPut from "../../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { SettingsType, SiteType } from "../../../../types/api";
import { UserStaffType } from "../../../../types/app";
import Checkbox from "../../../UI/Checkbox/Checkbox";

type SitesCheckboxesProps = {
  sites: SiteType[];
  sitesIds: number[];
  setSitesIds: React.Dispatch<React.SetStateAction<number[]>>;
};

const SitesCheckboxes = ({
  sites,
  sitesIds,
  setSitesIds,
}: SitesCheckboxesProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();

  const handleCheckAllSitesIds = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = e.target.checked;
    if (checked) {
      setSitesIds(sites.map(({ id }) => id));
      try {
        const datasToPut: SettingsType = {
          ...user.settings,
          sites_ids: sites.map(({ id }) => id),
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
      setSitesIds([]);
      try {
        const datasToPut: SettingsType = {
          ...user.settings,
          sites_ids: [],
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
  const handleCheckSiteId = async (
    e: React.ChangeEvent<HTMLInputElement>,
    siteId: number
  ) => {
    const checked = e.target.checked;
    let updatedSitesIds: number[];

    if (checked) {
      const sitesIdsSet = new Set([...sitesIds, siteId].filter(Boolean));
      const activeSitesIds = sites
        .filter(({ site_status }) => site_status !== "Closed")
        .map(({ id }) => id);
      const activeSiteIds = sites
        .filter(({ site_status }) => site_status !== "Closed")
        .map(({ id }) => id);
      const allActiveSitesSelected = activeSiteIds.every((id) =>
        sitesIdsSet.has(id)
      );
      updatedSitesIds = allActiveSitesSelected
        ? sites.map(({ id }) => id).filter(Boolean)
        : [...sitesIdsSet];

      setSitesIds(updatedSitesIds);
      try {
        const datasToPut: SettingsType = {
          ...user.settings,
          sites_ids: updatedSitesIds,
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
      setSitesIds(sitesIds.filter((id) => id !== siteId));
      try {
        const datasToPut: SettingsType = {
          ...user.settings,
          sites_ids: sitesIds.filter((id) => id !== siteId),
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
  const isSiteIdChecked = (siteId: number) => {
    return sitesIds.includes(siteId);
  };
  const isAllSitesIdsChecked = () => {
    return sitesIds.length === sites.length ? true : false;
  };

  return (
    sites && (
      <ul className="calendar__site-checkboxes">
        <li className="calendar__site-checkboxes-title">
          <Checkbox
            id="sites"
            onChange={handleCheckAllSitesIds}
            checked={isAllSitesIdsChecked()}
            label="Sites"
          />
        </li>
        {sites &&
          sites
            .filter(({ site_status }) => site_status !== "Closed")
            .map((site) => (
              <li key={site.id} className="calendar__site-checkboxes-item">
                <Checkbox
                  id={`site-${site.id}`} //to not confound with staff id
                  onChange={(e) => handleCheckSiteId(e, site.id as number)}
                  checked={isSiteIdChecked(site.id)}
                  label={site.name}
                />
              </li>
            ))}
      </ul>
    )
  );
};

export default SitesCheckboxes;
