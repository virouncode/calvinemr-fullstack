import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

type VideoIconProps = {
  ml?: number;
  mr?: number;
};
const VideoIcon = ({ ml, mr }: VideoIconProps) => {
  return (
    <FontAwesomeIcon
      icon={faVideo}
      style={{
        marginLeft: `${ml}px`,
        marginRight: `${mr}px`,
      }}
      className="icon"
    />
  );
};

export default VideoIcon;
