import React, { useEffect } from "react";
import { MedType } from "../types/api";

const usePrescriptionMultipage = (
  bodyRef: React.MutableRefObject<HTMLDivElement | null>,
  freeText: string,
  addedMeds: Partial<MedType>[],
  setMainBody: React.Dispatch<React.SetStateAction<string>>,
  setAdditionalBodies: React.Dispatch<React.SetStateAction<string[]>>,
  setPages: React.Dispatch<React.SetStateAction<number[]>>
) => {
  useEffect(() => {
    if (bodyRef.current) {
      //=============================FIRST PAGE================================//
      if (bodyRef.current.scrollHeight > bodyRef.current.clientHeight) {
        //if overflow
        //Create a new Page
        const additionalPages = [0];
        const addedMedsInstructions = addedMeds.map(
          ({ PrescriptionInstructions }) => PrescriptionInstructions
        );
        let mainbody = "";
        let additionalbodies: string[] = [];
        //Create an overflow test div to see when the overflow happens
        const myDiv = document.createElement("div");
        myDiv.style.whiteSpace = "pre-wrap";
        myDiv.style.width = "671.7px";
        myDiv.style.height = "500px";
        myDiv.style.fontSize = "$size-sm";
        myDiv.style.fontFamily = "Lato, sans-serif";
        myDiv.style.overflow = "scroll";
        myDiv.style.padding = "0 20px";
        myDiv.style.textAlign = "justify";
        myDiv.style.border = "solid 1px red";
        document.body.appendChild(myDiv);
        let i = 0;
        while (
          myDiv.scrollHeight === myDiv.clientHeight &&
          i < addedMedsInstructions.length
        ) {
          myDiv.textContent += addedMedsInstructions[i] + "\n\n";
          i++;
        }
        document.body.removeChild(myDiv);
        if (i === addedMeds.length) {
          //addedMedsInstructions does not overflow, so freeText is responsible for the overflow
          mainbody = addedMedsInstructions.join("\n\n");
          additionalbodies = [freeText];
          setMainBody(mainbody);
          setAdditionalBodies(additionalbodies);
          setPages(additionalPages);
          return;
        }
        //addedMedsInstructions overflow
        //i will be the index of the first element that will be on the next page
        mainbody = addedMedsInstructions.slice(0, i - 1).join("\n\n");
        const additionalInstructions = addedMedsInstructions.slice(i - 1);
        additionalbodies = [
          additionalInstructions.join("\n\n") + "\n\n" + freeText,
        ];
        //=========================================================================//

        //=============================ADDITIONAL PAGES============================//
        let counter = 1;
        while (additionalInstructions.length) {
          //Create an overflow test div to see if overflow happens
          const myDivAdditional = document.createElement("div");
          myDivAdditional.style.whiteSpace = "pre-wrap";
          myDivAdditional.style.width = "671.7px";
          myDivAdditional.style.height = "500px";
          myDivAdditional.style.fontSize = "$size-sm";
          myDivAdditional.style.fontFamily = "Lato, sans-serif";
          myDivAdditional.style.overflow = "scroll";
          myDivAdditional.style.padding = "0 20px";
          myDivAdditional.style.textAlign = "justify";
          document.body.appendChild(myDivAdditional);
          myDivAdditional.textContent =
            additionalInstructions.join("\n\n") + "\n\n" + freeText;

          if (myDivAdditional.scrollHeight <= myDivAdditional.clientHeight) {
            //No overflow
            document.body.removeChild(myDivAdditional);
            setMainBody(mainbody);
            setAdditionalBodies(additionalbodies);
            setPages(additionalPages);
            return;
          } else {
            //Overflow
            //Add a new Page
            additionalPages.push(counter);
            //reset the test div
            myDivAdditional.textContent = "";
            let j = 0;
            while (
              myDivAdditional.scrollHeight === myDivAdditional.clientHeight &&
              j < additionalInstructions.length
            ) {
              myDivAdditional.textContent += additionalInstructions[j] + "\n\n";
              j++;
            }
            document.body.removeChild(myDivAdditional);
            if (j === additionalInstructions.length) {
              //instructions does not overflow, so freeText is responsible for the overflow
              additionalbodies[counter - 1] =
                additionalInstructions.join("\n\n");
              additionalbodies[counter] = freeText;
              setMainBody(mainbody);
              setAdditionalBodies(additionalbodies);
              setPages(additionalPages);
              return;
            }
            //instructions overflow
            additionalbodies[counter - 1] = additionalInstructions
              .slice(0, j - 1)
              .join("\n\n");
            const newAdditionalArray = additionalInstructions.slice(j - 1);
            additionalbodies[counter] =
              newAdditionalArray.join("\n\n") + "\n\n" + freeText;
            additionalPages.push(counter);
            counter++;
          }
        }
      }
    }
  }, [
    addedMeds,
    bodyRef,
    freeText,
    setAdditionalBodies,
    setMainBody,
    setPages,
  ]);
};

export default usePrescriptionMultipage;
