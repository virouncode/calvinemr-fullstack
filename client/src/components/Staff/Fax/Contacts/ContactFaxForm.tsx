import React, { useState } from "react";
import ErrorParagraph from "../../../UI/Paragraphs/ErrorParagraph";
import Radio from "../../../UI/Radio/Radio";
import DoctorFaxForm from "./DoctorFaxForm";
import OtherFaxForm from "./OtherFaxForm";
import PharmacyFaxForm from "./PharmacyFaxForm";

type ContactFaxFormProps = {
  initialFaxNumber: string;
  setAddFaxNumberVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const ContactFaxForm = ({
  initialFaxNumber,
  setAddFaxNumberVisible,
}: ContactFaxFormProps) => {
  //Hooks
  const [errMsgPost, setErrMsgPost] = useState("");
  const [contactType, setContactType] = useState("doctors");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContactType(value);
  };

  return (
    <div className="contact-fax__form">
      <div className="contact-fax__form-radios">
        <label>Add contact to:</label>
        <div className="contact-fax__form-radios-list">
          <div className="contact-fax__form-radios-item">
            <Radio
              id="doctors"
              value="doctors"
              checked={contactType === "doctors"}
              onChange={handleChange}
              label="Doctors directory"
              name="fax-contact-fax__type"
            />
          </div>
          <div className="contact-fax__form-radios-item">
            <Radio
              id="pharmacies"
              value="pharmacies"
              checked={contactType === "pharmacies"}
              onChange={handleChange}
              label="Pharmacies directory"
              name="fax-contact-fax__type"
            />
          </div>
          <div className="contact-fax__form-radios-item">
            <Radio
              id="others"
              value="others"
              checked={contactType === "others"}
              onChange={handleChange}
              label="Others directory"
              name="fax-contact-fax__type"
            />
          </div>
        </div>
      </div>
      {errMsgPost && <ErrorParagraph errorMsg={errMsgPost} />}
      {contactType === "doctors" && (
        <DoctorFaxForm
          initialFaxNumber={initialFaxNumber}
          setErrMsgPost={setErrMsgPost}
          setAddFaxNumberVisible={setAddFaxNumberVisible}
        />
      )}
      {contactType === "pharmacies" && (
        <PharmacyFaxForm
          initialFaxNumber={initialFaxNumber}
          setErrMsgPost={setErrMsgPost}
          setAddFaxNumberVisible={setAddFaxNumberVisible}
        />
      )}
      {contactType === "others" && (
        <OtherFaxForm
          initialFaxNumber={initialFaxNumber}
          setErrMsgPost={setErrMsgPost}
          setAddFaxNumberVisible={setAddFaxNumberVisible}
        />
      )}
    </div>
  );
};

export default ContactFaxForm;
