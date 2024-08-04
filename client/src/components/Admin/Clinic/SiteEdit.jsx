import { useState } from "react";
import { toast } from "react-toastify";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { provinceStateTerritoryCT } from "../../../omdDatas/codesTables";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../utils/strings/firstLetterUpper";
import { siteSchema } from "../../../validation/clinic/siteValidation";
import CancelButton from "../../UI/Buttons/CancelButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import GenericList from "../../UI/Lists/GenericList";
import CircularProgressMedium from "../../UI/Progress/CircularProgressMedium";
import RoomsForm from "./RoomsForm";

const SiteEdit = ({ infos, editVisible, setEditVisible }) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [formDatas, setFormDatas] = useState(infos);
  const [postalOrZip, setPostalOrZip] = useState("postal");
  const [progress, setProgress] = useState(false);

  const handleChangePostalOrZip = (e) => {
    setErrMsg("");
    setPostalOrZip(e.target.value);
    setFormDatas({
      ...formDatas,
      postal_code: "",
      zip_code: "",
    });
  };

  const handleCancel = () => {
    setEditVisible(false);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErrMsg("");
    if (file.size > 25000000) {
      toast.error("The file is over 25Mb, please choose another file", {
        containerId: "A",
      });
      return;
    }
    setIsLoadingFile(true);
    // setting up the reader
    let reader = new FileReader();
    reader.readAsDataURL(file);
    // here we tell the reader what to do when it's done reading...
    reader.onload = async (e) => {
      let content = e.target.result; // this is the content!
      try {
        let fileToUpload = await xanoPost("/upload/attachment", "admin", {
          content,
        });
        setFormDatas({ ...formDatas, logo: fileToUpload });
        setIsLoadingFile(false);
      } catch (err) {
        toast.error(`Error unable to load file: ${err.message}`, {
          containerId: "A",
        });
        setIsLoadingFile(false);
      }
    };
  };

  const handleChange = (e) => {
    setErrMsg("");
    const value = e.target.value;
    const name = e.target.name;
    if (name === "postalZipCode") {
      if (postalOrZip === "postal") {
        setFormDatas({ ...formDatas, postal_code: value, zip_code: "" });
        return;
      } else {
        setFormDatas({ ...formDatas, zip_code: value, postal_code: "" });
        return;
      }
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formDatas.rooms.find((room) => !room.title)) {
      setErrMsg("All rooms should have a Name");
      return;
    }
    if (formDatas.site_status === "Closed") {
      alert(
        "You have decided to close this site. Please inform all staff members to update their site information in the 'My Account' section."
      );
    }
    //Formatting
    const datasToPut = {
      ...formDatas,
      name: firstLetterUpper(formDatas.name),
      address: firstLetterUpper(formDatas.address),
      city: firstLetterUpper(formDatas.city),
      rooms: [
        ...formDatas.rooms
          .filter((room) => room.title)
          .map((room) => {
            return { id: room.id, title: firstLetterUpper(room.title) };
          }),
      ],
      updates: [
        ...formDatas.updates,
        { updated_by_id: user.id, date_updated: nowTZTimestamp() },
      ],
      email: formDatas.email.toLowerCase(),
    };
    //Validation
    if (formDatas.rooms.length === 0) {
      alert("Please add at least one room for the appointments");
      return;
    }
    try {
      await siteSchema.validate(datasToPut);
    } catch (err) {
      setErrMsg(err.message);
      return;
    }
    //Submission
    try {
      setProgress(true);
      const response = await xanoPut(`/sites/${infos.id}`, "admin", datasToPut);
      socket.emit("message", {
        route: "SITES",
        action: "update",
        content: { id: infos.id, data: response },
      });
      setEditVisible(false);
      toast.success(`Site successfully updated`, {
        containerId: "A",
      });
      setProgress(false);
    } catch (err) {
      toast.error(`Unable to update site: ${err.message}`, {
        containerId: "A",
      });
      setProgress(false);
    }
  };

  return (
    <div
      className="site-form__container"
      style={{ border: errMsg && editVisible && "solid 1.5px red" }}
    >
      {errMsg && <p className="site-form__err">{errMsg}</p>}
      <form className="site-form">
        <div className="site-form__column">
          <div className="site-form__row">
            <label htmlFor="name">Site name*:</label>
            <input
              type="text"
              onChange={handleChange}
              name="name"
              value={formDatas.name}
              autoComplete="off"
              id="name"
            />
          </div>
          <div className="site-form__row">
            <label htmlFor="address">Address*:</label>
            <input
              type="text"
              onChange={handleChange}
              name="address"
              value={formDatas.address}
              autoComplete="off"
              id="address"
            />
          </div>
          <div className="site-form__row">
            <label htmlFor="city">City*:</label>
            <input
              type="text"
              onChange={handleChange}
              name="city"
              value={formDatas.city}
              autoComplete="off"
              id="city"
            />
          </div>
          <div className="site-form__row">
            <label>Province/State*:</label>
            <GenericList
              list={provinceStateTerritoryCT}
              value={formDatas.province_state}
              handleChange={handleChange}
              name="province_state"
              autoComplete="off"
            />
          </div>
          <div className="site-form__row">
            <label htmlFor="postalZipCode">Postal/zip code*:</label>
            <select
              style={{ width: "15%", marginRight: "10px" }}
              name="PostalOrZip"
              value={postalOrZip}
              onChange={handleChangePostalOrZip}
            >
              <option value="postal">Postal</option>
              <option value="zip">Zip</option>
            </select>
            <input
              type="text"
              value={
                postalOrZip === "postal"
                  ? formDatas.postal_code
                  : formDatas.zip_code
              }
              style={{ width: "102px" }}
              onChange={handleChange}
              name="postalZipCode"
              autoComplete="off"
              id="postalZipCode"
            />
          </div>
          <div className="site-form__row">
            <label htmlFor="phone">Phone number*:</label>
            <input
              type="tel"
              onChange={handleChange}
              name="phone"
              value={formDatas.phone}
              autoComplete="off"
              id="phone"
            />
          </div>
          <div className="site-form__row">
            <label htmlFor="fax">Fax number:</label>
            <input
              type="tel"
              onChange={handleChange}
              name="fax"
              value={formDatas.fax}
              autoComplete="off"
              id="fax"
            />
          </div>
          <div className="site-form__row">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              onChange={handleChange}
              name="email"
              value={formDatas.email}
              autoComplete="off"
              id="email"
            />
          </div>
          <div className="site-form__row">
            <label htmlFor="status">Site status*:</label>
            <select
              name="site_status"
              value={formDatas.site_status}
              onChange={handleChange}
              id="status"
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div className="site-form__row site-form__row--special">
            <label>Site logo: </label>
            <div className="site-form__row-image">
              {isLoadingFile ? (
                <CircularProgressMedium />
              ) : formDatas.logo ? (
                <img
                  src={`${import.meta.env.VITE_XANO_BASE_URL}${
                    formDatas.logo?.path
                  }`}
                  alt="site-logo"
                  width="150px"
                />
              ) : (
                <img
                  src="https://placehold.co/200x100/png?font=roboto&text=Logo"
                  alt="logo-placeholder"
                />
              )}
              <input
                name="logo"
                type="file"
                accept=".jpeg, .jpg, .png, .tif, .pdf, .svg"
                onChange={handleLogoChange}
              />
            </div>
          </div>
        </div>
        <div className="site-form__column">
          <RoomsForm
            formDatas={formDatas}
            setFormDatas={setFormDatas}
            setErrMsg={setErrMsg}
          />
        </div>
      </form>
      <div className="site-form__btn-container">
        <SaveButton
          onClick={handleSubmit}
          disabled={isLoadingFile || progress}
        />
        <CancelButton onClick={handleCancel} disabled={progress} />
      </div>
    </div>
  );
};

export default SiteEdit;
