import React, { useState } from "react";
import MigrationExport from "./MigrationExport";
import MigrationImport from "./MigrationImport";
import MigrationToggle from "./MigrationToggle";

const Migration = () => {
  //Hooks
  const [type, setType] = useState<"Import" | "Export">("Export");

  const isTypeChecked = (option: "Import" | "Export") =>
    option === type ? true : false;

  const handleMigrationTypeChanged = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.value === "Import") {
      alert("Available soon...");
      return;
    }
    setType(e.target.value as "Import" | "Export");
  };

  return (
    <>
      <MigrationToggle
        isTypeChecked={isTypeChecked}
        handleMigrationTypeChanged={handleMigrationTypeChanged}
      />
      {type === "Export" ? <MigrationExport /> : <MigrationImport />}
    </>
  );
};

export default Migration;
