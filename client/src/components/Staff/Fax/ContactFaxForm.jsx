import { useState } from "react";
import ErrorParagraph from "../../UI/Paragraphs/ErrorParagraph";
import DoctorFaxForm from "./DoctorFaxForm";
import OtherFaxForm from "./OtherFaxForm";
import PharmacyFaxForm from "./PharmacyFaxForm";

const ContactFaxForm = ({ initialFaxNumber, setAddFaxNumberVisible }) => {
  const [errMsgPost, setErrMsgPost] = useState("");
  const [contactType, setContactType] = useState("doctors");
  const handleChange = (e) => {
    const value = e.target.value;
    setContactType(value);
  };

  return (
    <div className="contact-form">
      <div className="contact-form-radios">
        <label className="contact-form-radios__label">Add contact to:</label>
        <div className="contact-form-radios__list">
          <div className="contact-form-radios__item">
            <input
              type="radio"
              value="doctors"
              checked={contactType === "doctors"}
              id="doctors"
              onChange={handleChange}
            />
            <label htmlFor="doctors">Doctors directory</label>
          </div>
          <div className="contact-form-radios__item">
            <input
              type="radio"
              value="pharmacies"
              checked={contactType === "pharmacies"}
              id="pharmacies"
              onChange={handleChange}
            />
            <label htmlFor="pharmacies">Pharmacies directory</label>
          </div>
          <div className="contact-form-radios__item">
            <input
              type="radio"
              value="others"
              checked={contactType === "others"}
              id="others"
              onChange={handleChange}
            />
            <label htmlFor="others">Others directory</label>
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
