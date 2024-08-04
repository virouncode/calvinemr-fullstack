import { useState } from "react";
import { toast } from "react-toastify";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../utils/strings/firstLetterUpper";
import { siteSchema } from "../../../validation/clinic/siteValidation";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import FormSite from "./FormSite";

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
      {errMsg && <ErrorParagraph errorMsg={errMsg} />}
      <FormSite
        formDatas={formDatas}
        setFormDatas={setFormDatas}
        handleChange={handleChange}
        postalOrZip={postalOrZip}
        handleChangePostalOrZip={handleChangePostalOrZip}
        handleLogoChange={handleLogoChange}
        isLoadingFile={isLoadingFile}
        setErrMsg={setErrMsg}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        progress={progress}
      />
    </div>
  );
};

export default SiteEdit;
