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
  const { user } = useUserContext() as { user: UserStaffType };
  return (
    <div className="invitation__row">
      {templateSelected === "Video appointment" ? (
        <label>
          Appointment Infos (read only,{" "}
          <span style={{ color: "red" }}>
            please make sure you provided a video call link, see My Account
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
              <div>
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
