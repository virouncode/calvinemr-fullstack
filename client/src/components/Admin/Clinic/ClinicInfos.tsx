import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useClinicContext from "../../../hooks/context/useClinicContext";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { useSites } from "../../../hooks/reactquery/queries/sitesQueries";
import { AdminType, ClinicType, SiteType } from "../../../types/api";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { clinicSchema } from "../../../validation/clinic/clinicValidation";
import Button from "../../UI/Buttons/Button";
import CancelButton from "../../UI/Buttons/CancelButton";
import EditButton from "../../UI/Buttons/EditButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import InputEmailToggle from "../../UI/Inputs/InputEmailToggle";
import InputTextToggleLink from "../../UI/Inputs/InputTextToggleLink";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../UI/Windows/FakeWindow";
import SiteEdit from "./SiteEdit";
import SiteForm from "./SiteForm";
import SitesTable from "./SitesTable";

const ClinicInfos = () => {
  const { user } = useUserContext() as { user: AdminType };
  const { socket } = useSocketContext();
  const { clinic } = useClinicContext();
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editClinicVisible, setEditClinicVisible] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState(0);
  const [formDatas, setFormDatas] = useState(clinic as ClinicType);
  const [errMsgPost, setErrMsgPost] = useState("");

  const { data: sites, isPending, error } = useSites();

  const handleAddNew = () => {
    setAddVisible(true);
  };

  const handleEditClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    siteId: number
  ) => {
    setSelectedSiteId(siteId);
    setEditVisible(true);
  };

  const handleEditClinic = () => {
    setEditClinicVisible(true);
  };

  const handleCancelClinic = () => {
    setFormDatas(clinic as ClinicType);
    setEditClinicVisible(false);
  };

  const handleSaveClinic = async () => {
    try {
      await clinicSchema.validate(formDatas);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
      return;
    }
    try {
      setErrMsgPost("");
      let websiteFormatted = formDatas?.website;
      if (
        !formDatas?.website.includes("http") ||
        !formDatas?.website.includes("https")
      ) {
        websiteFormatted = ["https://", formDatas?.website].join("");
      }
      const clinicToPut: ClinicType = {
        ...formDatas,
        website: websiteFormatted,
        updates: [
          ...(formDatas?.updates || []),
          { updated_by_id: user.id, date_updated: nowTZTimestamp() },
        ],
      };
      const response: ClinicType = await xanoPut(
        `/clinic/${clinic?.id}`,
        "admin",
        clinicToPut
      );
      socket?.emit("message", {
        route: "CLINIC",
        action: "update",
        content: {
          id: clinic?.id,
          data: response,
        },
      });
      toast.success(`Clinic infos changed successfully`, { containerId: "A" });
      setEditClinicVisible(false);
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Unable to change clinic infos: ${err.message}`, {
          containerId: "A",
        });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    setFormDatas({ ...formDatas, [name]: value });
  };

  if (isPending) return <LoadingParagraph />;
  if (error) return <ErrorParagraph errorMsg={error.message} />;

  return (
    <>
      <div className="clinic__global-infos">
        <div className="clinic__global-infos-title">
          <div className="clinic__global-infos-label">Clinic infos</div>
          <div className="clinic__global-infos-btn-container">
            {editClinicVisible ? (
              <>
                <SaveButton onClick={handleSaveClinic} />
                <CancelButton onClick={handleCancelClinic} />
              </>
            ) : (
              <EditButton onClick={handleEditClinic} />
            )}
          </div>
        </div>
        <div className="clinic__global-infos-form">
          <div className="clinic__global-infos-item">
            <InputEmailToggle
              value={formDatas?.email}
              onChange={handleChange}
              name="email"
              id="email"
              editVisible={editClinicVisible}
              label="Email: "
            />
          </div>
          <div className="clinic__global-infos-item">
            <InputTextToggleLink
              value={formDatas?.website}
              onChange={handleChange}
              name="website"
              id="website"
              editVisible={editClinicVisible}
              label="Website: "
              placeholder="https://www.my-clinic.com"
            />
          </div>
        </div>
      </div>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      <div className="clinic__sites">
        <div className="clinic__sites-title">
          <div className="clinic__sites-label">Sites</div>
          <div className="clinic__sites-btn-container">
            <Button label="New site" onClick={handleAddNew} />
          </div>
        </div>
        <SitesTable sites={sites} handleEditClick={handleEditClick} />
        {addVisible && (
          <FakeWindow
            title="ADD A NEW SITE"
            width={1000}
            height={800}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 800) / 2}
            color="#94bae8"
            setPopUpVisible={setAddVisible}
          >
            <SiteForm setAddVisible={setAddVisible} />
          </FakeWindow>
        )}
        {editVisible && (
          <FakeWindow
            title={`EDIT ${
              sites
                .find(({ id }) => id === selectedSiteId)
                ?.name.toUpperCase() ?? ""
            } Site`}
            width={1000}
            height={600}
            x={(window.innerWidth - 1000) / 2}
            y={(window.innerHeight - 600) / 2}
            color="#94bae8"
            setPopUpVisible={setEditVisible}
          >
            <SiteEdit
              site={sites.find(({ id }) => id === selectedSiteId) as SiteType}
              setEditVisible={setEditVisible}
              editVisible={editVisible}
            />
          </FakeWindow>
        )}
      </div>
    </>
  );
};

export default ClinicInfos;
