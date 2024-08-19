import React, { useState } from "react";
import NewWindow from "react-new-window";
import { MessageAttachmentType } from "../../../types/api";
import XmarkIcon from "../../UI/Icons/XmarkIcon";

type FaxAttachmentCardProps = {
  handleRemoveAttachment: (fileName: string) => void;
  attachment: Partial<MessageAttachmentType>;
  deletable: boolean;
  cardWidth?: string;
};

const FaxAttachmentCard = ({
  handleRemoveAttachment,
  attachment,
  deletable,
  cardWidth = "20%",
}: FaxAttachmentCardProps) => {
  const [popUpVisible, setPopUpVisible] = useState(false);
  const handleImgClick = () => {
    setPopUpVisible(true);
  };

  return (
    <>
      <div className="fax-attachment__card" style={{ width: cardWidth }}>
        <div className="fax-attachment__thumbnail">
          {attachment.file?.mime?.includes("image") ? (
            <img
              src={`${import.meta.env.VITE_XANO_BASE_URL}${
                attachment.file.path
              }`}
              alt="attachment thumbnail"
              width="100%"
              onClick={handleImgClick}
            />
          ) : attachment.file?.mime?.includes("video") ? (
            <video onClick={handleImgClick} width="100%">
              <source
                src={`${import.meta.env.VITE_XANO_BASE_URL}${
                  attachment.file.path
                }`}
                type={attachment.file.mime}
              />
            </video>
          ) : attachment.file?.mime?.includes("officedocument") ? (
            <div>
              <div
                style={{ color: "blue", fontSize: "0.8rem" }}
                onClick={handleImgClick}
              >
                Preview document
              </div>{" "}
              <iframe
                title="office document"
                src={`https://docs.google.com/gview?url=${
                  import.meta.env.VITE_XANO_BASE_URL
                }${attachment.file.path}&embedded=true&widget=false`}
                onClick={handleImgClick}
                width="150%"
                frameBorder="0"
              ></iframe>
            </div>
          ) : (
            <div>
              <iframe
                id="thumbnail-doc"
                title={attachment.alias}
                src={`${import.meta.env.VITE_XANO_BASE_URL}${
                  attachment.file?.path
                }`}
                width="100%"
              />
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  width: "100%",
                  height: "100%",
                  opacity: "0",
                  cursor: "pointer",
                }}
                onClick={handleImgClick}
              ></div>
            </div>
          )}
        </div>
        <div className="fax-attachment__footer">
          <div className="fax-attachment__title">
            <p
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                padding: "0",
              }}
            >
              {attachment.alias}
            </p>
            {deletable && (
              <XmarkIcon
                onClick={() =>
                  handleRemoveAttachment(attachment.file?.name ?? "")
                }
              />
            )}
          </div>
        </div>
      </div>
      {popUpVisible && (
        <NewWindow
          title={attachment.alias}
          features={{
            toolbar: "no",
            scrollbars: "no",
            menubar: "no",
            status: "no",
            directories: "no",
            width: 800,
            height: 600,
            left: 320,
            top: 200,
          }}
          onUnload={() => setPopUpVisible(false)}
        >
          {attachment.file?.mime.includes("image") ? (
            <img
              src={`${import.meta.env.VITE_XANO_BASE_URL}${
                attachment.file.path
              }`}
              alt=""
              width="100%"
            />
          ) : attachment.file?.mime.includes("video") ? (
            <video width="100%" controls>
              <source
                src={`${import.meta.env.VITE_XANO_BASE_URL}${
                  attachment.file.path
                }`}
                type={attachment.file.mime}
              />
            </video>
          ) : attachment.file?.mime.includes("officedocument") ? (
            <iframe
              title="office document"
              src={`https://docs.google.com/gview?url=${
                import.meta.env.VITE_XANO_BASE_URL
              }${attachment.file.path}&embedded=true&widget=false`}
              width="100%"
              height="100%"
            />
          ) : (
            <iframe
              title={attachment.alias}
              src={`${import.meta.env.VITE_XANO_BASE_URL}${
                attachment.file?.path
              }`}
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          )}
        </NewWindow>
      )}
    </>
  );
};

export default FaxAttachmentCard;
