import React from "react";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { SiteType } from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import SiteSelect from "../../../../UI/Lists/SiteSelect";

type InvitationInfosProps = {
  templateSelected: string;
  handleSiteChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  sites: SiteType[];
  siteSelectedId: number;
};

const InvitationInfos = ({
  templateSelected,
  handleSiteChange,
  sites,
  siteSelectedId,
}: InvitationInfosProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };

  return (
    <div className="event-form__invitation-infos">
      {templateSelected === "Video appointment - MD is ready" ? (
        <label>
          Appointment Infos (read only,{" "}
          <span style={{ color: "red" }}>
            please make sure the host provided a video call link, see My Account
            section
          </span>
          )
        </label>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          <label>Appointment Infos (read only)</label>
          {templateSelected !== "Video appointment" &&
            templateSelected !== "Phone appointment" &&
            templateSelected !== "[Blank]" && (
              <div className="site-select">
                <SiteSelect
                  label="Site"
                  handleSiteChange={handleSiteChange}
                  sites={sites}
                  value={siteSelectedId}
                />
              </div>
            )}
        </div>
      )}
      <textarea
        value={
          user.settings.invitation_templates.find(
            ({ name }) => name === templateSelected
          )?.infos ?? ""
        }
        readOnly
        style={{ height: "130px" }}
      />
    </div>
  );
};

export default InvitationInfos;
