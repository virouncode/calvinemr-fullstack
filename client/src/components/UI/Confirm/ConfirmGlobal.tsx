import React, { useRef, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

// Define a global variable with a type for confirmAction
const confirmAction = {
  current: ({
    title,
    content,
    yes,
    no,
  }: {
    title: string;
    content: string;
    yes: string;
    no: string;
  }) => Promise.resolve(true),
};

// Define the confirmAlert function to call the current confirmAction
export const confirmAlert = ({
  title = "",
  content,
  yes = "Yes",
  no = "Cancel",
}: {
  title?: string;
  content: string;
  yes?: string;
  no?: string;
}) => {
  return confirmAction.current({ title, content, yes, no });
};

type ConfirmGlobalProps = {
  isPopUp?: boolean;
};

const ConfirmGlobal = ({ isPopUp = false }: ConfirmGlobalProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [props, setProps] = useState<{
    title: string;
    content: string;
    yes: string;
    no: string;
  }>({
    title: "",
    content: "",
    yes: "",
    no: "",
  });
  const resolveRef = useRef<(value: boolean | PromiseLike<boolean>) => void>(
    () => {}
  );

  // Set up confirmAction to update state and return a promise
  confirmAction.current = ({
    title = "",
    content = "",
    yes = "Yes",
    no = "Cancel",
  }) =>
    new Promise<boolean>((resolve) => {
      setProps({ title, content, yes, no });
      setOpen(true);
      resolveRef.current = resolve;
    });

  const handleConfirm = () => {
    setOpen(false);
    setProps({ title: "", content: "", yes: "", no: "" });
    resolveRef.current(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setProps({ title: "", content: "", yes: "", no: "" });
    resolveRef.current(false);
  };

  return (
    open && (
      <ConfirmDialog
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        props={props}
        isPopUp={isPopUp}
      />
    )
  );
};

export default ConfirmGlobal;
