import React from "react";
import { provinceStateTerritoryCT } from "../../../omdDatas/codesTables";
import { SiteFormType, SiteType } from "../../../types/api";
import CancelButton from "../../UI/Buttons/CancelButton";
import SaveButton from "../../UI/Buttons/SaveButton";
import Input from "../../UI/Inputs/Input";
import InputEmail from "../../UI/Inputs/InputEmail";
import InputImgFile from "../../UI/Inputs/InputImgFile";
import InputTel from "../../UI/Inputs/InputTel";
import GenericList from "../../UI/Lists/GenericList";
import PostalZipSelectInput from "../../UI/Lists/PostalZipSelectInput";
import SiteStatusSelect from "../../UI/Lists/SiteStatusSelect";
import RoomsForm from "./RoomsForm";

type FormSiteProps = {
  formDatas: SiteFormType | SiteType;
  setFormDatas: React.Dispatch<React.SetStateAction<SiteFormType | SiteType>>;
  handleChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => void;
  postalOrZip: string;
  handleChangePostalOrZip: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoadingFile: boolean;
  setErrMsg: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: () => Promise<void>;
  handleCancel: () => void;
  progress: boolean;
};

const FormSite = ({
  formDatas,
  setFormDatas,
  handleChange,
  postalOrZip,
  handleChangePostalOrZip,
  handleLogoChange,
  isLoadingFile,
  setErrMsg,
  handleSubmit,
  handleCancel,
  progress,
}: FormSiteProps) => {
  return (
    <>
      <form className="site-form">
        <div className="site-form__column">
          <div className="site-form__row">
            <Input
              label="Site name*:"
              name="name"
              id="name"
              value={formDatas?.name ?? ""}
              onChange={handleChange}
            />
          </div>
          <div className="site-form__row">
            <Input
              label="Address*:"
              name="address"
              id="address"
              value={formDatas?.address ?? ""}
              onChange={handleChange}
            />
          </div>
          <div className="site-form__row">
            <Input
              label="City*:"
              name="city"
              id="city"
              value={formDatas?.city ?? ""}
              onChange={handleChange}
            />
          </div>
          <div className="site-form__row">
            <GenericList
              list={provinceStateTerritoryCT}
              value={formDatas?.province_state ?? ""}
              handleChange={handleChange}
              name="province_state"
              label="Province/State*:"
              placeHolder="Choose province/state..."
            />
          </div>
          <div className="site-form__row">
            <PostalZipSelectInput
              onChangeSelect={handleChangePostalOrZip}
              postalOrZip={postalOrZip}
              value={
                postalOrZip === "postal"
                  ? formDatas?.postal_code ?? ""
                  : formDatas?.zip_code ?? ""
              }
              onChangeInput={handleChange}
              name="postalZipCode"
              id="postalZipCode"
              inputWidth={102}
              placeholder={
                postalOrZip === "postal" ? "A1A 1A1" : "12345 or 12345-6789"
              }
            />
          </div>
          <div className="site-form__row">
            <InputTel
              value={formDatas?.phone ?? ""}
              onChange={handleChange}
              name="phone"
              id="phone"
              label="Phone number*:"
              placeholder="xxx-xxx-xxxx"
            />
          </div>
          <div className="site-form__row">
            <InputTel
              value={formDatas?.fax ?? ""}
              onChange={handleChange}
              name="fax"
              id="fax"
              label="Fax number:"
              placeholder="xxx-xxx-xxxx"
            />
          </div>
          <div className="site-form__row">
            <InputEmail
              value={formDatas?.email ?? ""}
              onChange={handleChange}
              name="email"
              id="email"
              label="Email:"
            />
          </div>
          <div className="site-form__row">
            <SiteStatusSelect
              value={formDatas?.site_status ?? "Open"}
              onChange={handleChange}
            />
          </div>
          <div className="site-form__row">
            <label>Site logo: </label>
            <div className="site-form__row-image">
              <InputImgFile
                isLoadingFile={isLoadingFile}
                onChange={handleLogoChange}
                img={formDatas?.logo ?? null}
                alt="site-logo"
                width={150}
                placeholderText="Logo"
              />
            </div>
          </div>
        </div>
        <div className="site-form__column">
          <RoomsForm
            formDatas={formDatas}
            setFormDatas={setFormDatas}
            setErrMsg={setErrMsg}
          />
        </div>
      </form>
      <div className="site-form__btn-container">
        <SaveButton
          onClick={handleSubmit}
          disabled={isLoadingFile || progress}
        />
        <CancelButton onClick={handleCancel} disabled={progress} />
      </div>
    </>
  );
};

export default FormSite;
