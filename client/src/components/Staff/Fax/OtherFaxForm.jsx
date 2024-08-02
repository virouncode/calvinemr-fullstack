import { useState } from "react";
import useUserContext from "../../../hooks/context/useUserContext";
import { useFaxDirectoryPost } from "../../../hooks/reactquery/mutations/faxDirectoryMutations";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import { firstLetterUpper } from "../../../utils/strings/firstLetterUpper";
import { otherSchema } from "../../../validation/others/otherValidation";
import CircularProgressSmall from "../../UI/Progress/CircularProgressSmall";

const OtherFaxForm = ({
  initialFaxNumber,
  setErrMsgPost,
  setAddFaxNumberVisible,
}) => {
  const { user } = useUserContext();
  const [formDatas, setFormDatas] = useState({
    name: "",
    category: "",
    fax: initialFaxNumber,
  });
  const [progress, setProgress] = useState(false);
  const faxDirectoryPost = useFaxDirectoryPost();

  const handleChange = (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    setFormDatas({ ...formDatas, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    //Validation
    try {
      await otherSchema.validate(formDatas);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }

    //Formatting
    const otherToPost = {
      name: firstLetterUpper(formDatas.name),
      category: firstLetterUpper(formDatas.category),
      fax_number: formDatas.fax,
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
    };
    setProgress(true);
    //Submission

    faxDirectoryPost.mutate(otherToPost, {
      onSuccess: () => {
        setAddFaxNumberVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };

  const handleCancel = (e) => {
    setAddFaxNumberVisible(false);
  };

  return (
    <div className="other-fax__form">
      <div className="other-fax__form-row">
        <label htmlFor="name">Name:</label>
        <input
          name="name"
          type="text"
          value={formDatas.name}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="other-fax__form-row">
        <label htmlFor="category">Category:</label>
        <input
          name="category"
          type="text"
          value={formDatas.category}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      <div className="other-fax__form-row">
        <label htmlFor="fax">Fax:</label>
        <input
          name="fax"
          type="text"
          value={formDatas.fax}
          onChange={handleChange}
          autoComplete="off"
          placeholder="xxx-xxx-xxxx"
        />
      </div>
      <div className="other-fax__form-btns">
        <button onClick={handleSubmit} className="save-btn" disabled={progress}>
          Save
        </button>
        <button onClick={handleCancel} disabled={progress}>
          Cancel
        </button>
        {progress && <CircularProgressSmall />}
      </div>
    </div>
  );
};

export default OtherFaxForm;
