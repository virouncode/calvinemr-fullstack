import React from "react";
import { Combobox } from "react-widgets";

const tests = [
  "Folic acid intake (ask parient periodically)",
  "HIV 1 AND 2",
  "HTLV 1 and 2",
  "HBs Antigen",
  "Hepatitis C serology",
  "VDRL",
  "CMV IgG",
  "Varicella IgG",
  "Parvovirus B19 IgG",
  "Rubella IgG",
  "Chlamydia PCR urine",
  "Gonorrhea PCR urine",
  "Blood type",
  "Rhesus",
  "CBC",
  "Hemoglobin electrophoresis",
  "HbA1c",
  "Testosterone",
  "SHBG",
  "Albumin",
  "DHEAS",
  "Lipid profile",
  "Mammogram",
  "Pap test",
  "HPV test",
  "Caryotype",
  "Y-chromosome micro-deletions",
  "Lupus anticoagulant",
  "Anti-cardiolipin antibodies",
  "Anti Beta-2 glycoprotein I",
  "TSH",
  "PRL",
  "Anti-Mullerian Hormone (pmol/L)",
  "Pelvic ultrasound - uterus / fibroids",
  "Pelvic ultrasound - right ovary",
  "Pelvic ultrasound - right AFC",
  "Pelvic ultrasound - left ovary",
  "Pelvic ultrasound - left AFC",
  "Sonohysterogram - uterine cavity",
  "Sonohysterogram - left tube",
  "Sonohysterogram - right tube",
  "Dye test - uterine cavity",
  "Dye test - left tube",
  "Dye test - right tube",
  "Endometrial biopsy - pathology",
  "Endometrial biopsy - CD138/Plasmocytes",
  "Semen analysis - Volume (mL)",
  "Semen analysis - Concentration (million/mL)",
  "Semen analysis - Progressive motility (%)",
  "Semen analysis - Total Motile count",
  "Semen analysis - Normal Morphology Kruger (%)",
  "Semen analysis - Normal Morphology non Kruger (%)",
  "Sperm DNA fragmentation (%)",
  "Scrotal ultrasound",
  "Extended Carrier Screening",
  "Cystic fibrosis testing",
  "Toxicology",
  "Colonoscopy/Sigmoidoscopy",
  "Hemoccult Multiphase FOBT/FIT",
  "Bone Mineral Density",
  "CT-scan",
  "MRI",
];

type TestsListProps = {
  handleChange: (value: string) => void;
  value: string;
};

const TestsList = ({ handleChange, value }: TestsListProps) => {
  return (
    <Combobox
      placeholder="Choose or type..."
      value={value}
      onChange={(value) => handleChange(value)}
      data={tests}
    />
  );
};

export default TestsList;
