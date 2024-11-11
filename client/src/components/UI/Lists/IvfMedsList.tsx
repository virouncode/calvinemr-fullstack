import React from "react";
import { Combobox } from "react-widgets/cjs";
const ivfMeds = [
  "Letrozole",
  "Clomiphene",
  "Tamoxifen",
  "Gonal F",
  "Puregon",
  "Menopur",
  "Rekovelle",
  "Pergoveris",
  "Luveris",
  "Cetrotide",
  "Orgalutran",
  "Omnitrope/Saizen",
  "Testogel",
  "DHEAS",
  "Orilissa",
  "Provera",
  "Progesterone suppositories",
  "Crinone",
  "Progesterone in oil",
  "Prometrium",
  "Decapeptyl Down regulation",
  "Decapeptyl Down flare",
  "Decapeptyl trigger",
  "Lupron Down regulation",
  "Lupron Down flare",
  "Lupron trigger",
  "Ovidrel",
  "hCG trigger",
  "hCG luteal",
  "Letrozole luteal",
  "Orgalutran luteal",
  "Cetrotide luteal",
];

type IvfMedsListProps = {
  handleChange: (value: string, med_number: number) => void;
  value: string;
  med_number: number;
  index: number;
};

const IvfMedsList = ({
  handleChange,
  value,
  med_number,
  index,
}: IvfMedsListProps) => {
  return (
    <Combobox
      placeholder="Choose or type..."
      value={value}
      onChange={(value) => handleChange(value, med_number)}
      data={ivfMeds}
      dropUp={index >= 3}
    />
  );
};

export default IvfMedsList;
