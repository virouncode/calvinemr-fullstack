import { useRef, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

//We define a global variable confirmAction with a current property that is a function that returns a Promise
const confirmAction = {
  current: () => Promise.resolve(true),
};

//When calling confirm alert we call confirmAction.current with the parameters of confirmAlert
export const confirmAlert = ({ title, content, yes, no }) => {
  return confirmAction.current({ title, content, yes, no });
};

const ConfirmGlobal = ({ isPopUp = false }) => {
  const [open, setOpen] = useState(false);
  const [props, setProps] = useState({
    title: "",
    content: "",
    yes: "",
    no: "",
  });
  const resolveRef = useRef(() => {});

  //When mounting ConfirmGlobal we redefine confirmAction.current as a function that takes a {title, content, yes and no} as parameters, setProps with these parameters, pass those props and open the dialog,  and returns a Promise.
  //The resolve function of the promise is extracted thanks to resolveRef
  confirmAction.current = ({
    title = "",
    content = "",
    yes = "Yes",
    no = "Cancel",
  }) =>
    new Promise((resolve) => {
      setProps({ title, content, yes, no });
      setOpen(true);
      resolveRef.current = resolve;
    });

  return (
    open && (
      <ConfirmDialog
        onConfirm={() => {
          setOpen(false);
          setProps({ title: "", content: "", yes: "", no: "" });
          resolveRef.current(true); //on execute resolve(true) ( donc le if va être validé et on continue )
        }}
        onCancel={() => {
          setOpen(false);
          setProps({ title: "", content: "", yes: "", no: "" });
          resolveRef.current(false); //on execute resolve(false)) ( donc le if va bloquer )
        }}
        open={open}
        props={props}
        isPopUp={isPopUp}
      />
    )
  );
};

export default ConfirmGlobal;
