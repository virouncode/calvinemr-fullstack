import { useState } from "react";
import { toast } from "react-toastify";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import useUserContext from "../../../hooks/context/useUserContext";
import { nowTZTimestamp } from "../../../utils/dates/formatDates";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";

import { usePamphletPost } from "../../../hooks/reactquery/mutations/pamphletsMutations";
import { pamphletSchema } from "../../../validation/reference/pamphletValidation";

const PamphletForm = ({ errMsgPost, setErrMsgPost, setAddVisible }) => {
  const { user } = useUserContext();
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [progress, setProgress] = useState(false);
  const [formDatas, setFormDatas] = useState({
    name: "",
    created_by_id: user.id,
    notes: "",
  });
  const pamphletPost = usePamphletPost();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsgPost("");
    //Formatting
    const datasToPost = {
      ...formDatas,
      date_created: nowTZTimestamp(),
    };
    //Validation
    try {
      await pamphletSchema.validate(datasToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    if (!datasToPost.file) {
      setErrMsgPost("Please upload a file");
      return;
    }
    setProgress(true);
    pamphletPost.mutate(datasToPost, {
      onSuccess: () => {
        setAddVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };
  const handleCancel = () => {
    setAddVisible(false);
  };
  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormDatas({ ...formDatas, [name]: value });
  };
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErrMsgPost("");
    setIsLoadingFile(true);
    if (file.size > 25000000) {
      setErrMsgPost("The file is over 25Mb, please choose another file");
      setIsLoadingFile(false);
      return;
    }
    // setting up the reader
    setIsLoadingFile(true);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    // here we tell the reader what to do when it's done reading...
    reader.onload = async (e) => {
      let content = e.target.result; // this is the content!
      try {
        const fileToUpload = await xanoPost("/upload/attachment", "staff", {
          content,
        });
        setIsLoadingFile(false);
        setFormDatas({
          ...formDatas,
          file: fileToUpload,
        });
      } catch (err) {
        setIsLoadingFile(false);
        toast.error(`Error unable to load document: ${err.message}`, {
          containerId: "A",
        });
      }
    };
  };
  return (
    <div
      className="reference-edocs__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <form className="reference-edocs__content" onSubmit={handleSubmit}>
        {errMsgPost && <div className="reference-edocs__err">{errMsgPost}</div>}
        <div className="reference-edocs__form-btn-container">
          <input
            type="submit"
            value={isLoadingFile ? "Loading" : "Save"}
            disabled={isLoadingFile || progress}
          />
          <CancelButton onClick={handleCancel} />
        </div>
        <div className="reference-edocs__row">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            vlaue={formDatas.name}
            onChange={handleChange}
            name="name"
            autoComplete="off"
            id="name"
          />
        </div>
        <div className="reference-edocs__row">
          <label>File</label>
          <input
            name="Content"
            type="file"
            onChange={handleUpload}
            accept=".pdf,.jpeg, .jpg, .png, .gif, .tif, .pdf, .svg"
            // ".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg, .mp3, .aac, .aiff, .flac, .ogg, .wma, .wav, .mov, .mp4, .avi, .wmf, .flv, .doc, .docm, .docx, .txt, .csv, .xls, .xlsx, .ppt, .pptx"
          />
        </div>
        <div className="reference-edocs__row reference-edocs__row--text">
          <label htmlFor="notes">Notes</label>
          <textarea
            name="notes"
            value={formDatas.notes || ""}
            onChange={handleChange}
            autoComplete="off"
            id="notes"
          />
        </div>
      </form>
      <div className="reference-edocs__preview">
        {isLoadingFile && <LoadingParagraph />}
        {formDatas.file && formDatas.file.mime?.includes("image") ? (
          <img
            src={`${import.meta.env.VITE_XANO_BASE_URL}${formDatas.file.path}`}
            alt=""
            width="100%"
          />
        ) : formDatas.file && formDatas.file.mime?.includes("video") ? (
          <video controls>
            <source
              src={`${import.meta.env.VITE_XANO_BASE_URL}${
                formDatas.file.path
              }`}
              type={formDatas.file.mime}
            />
          </video>
        ) : formDatas.file &&
          formDatas.file.mime?.includes("officedocument") ? (
          <div>
            <iframe
              title="office document"
              src={`https://docs.google.com/gview?url=${
                import.meta.env.VITE_XANO_BASE_URL
              }${formDatas.file.path}&embedded=true&widget=false`}
              width="100%"
              height="500px"
              frameBorder="0"
            />
          </div>
        ) : (
          formDatas.file && (
            <iframe
              title={formDatas.name}
              src={`${import.meta.env.VITE_XANO_BASE_URL}${
                formDatas.file.path
              }`}
              type={formDatas.file.type}
              width="100%"
              style={{ border: "none" }}
              height="500px"
            />
          )
        )}
      </div>
    </div>
  );
};

export default PamphletForm;
