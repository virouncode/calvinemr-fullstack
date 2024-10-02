import { useEffect } from "react";

const useRecordInfosMultipage = (
  recordInfosBodyRef: React.MutableRefObject<HTMLDivElement | null>,
  setRecordInfosMainBody: React.Dispatch<React.SetStateAction<string>>,
  setRecordInfosAdditionalBodies: React.Dispatch<
    React.SetStateAction<string[]>
  >,
  setRecordInfosPages: React.Dispatch<React.SetStateAction<number[]>>
) => {
  useEffect(() => {
    if (!recordInfosBodyRef?.current) return;
    if (
      recordInfosBodyRef.current.scrollHeight >
      recordInfosBodyRef.current.clientHeight
    ) {
      let additionalPages: number[] = [];
      let mainbody = "";
      let additionalbodies: string[] = [];

      //Main page (page -1)
      const wordArray = recordInfosBodyRef?.current?.innerText.split(" "); //All the words
      //Create an overflow test div
      const myDiv = document.createElement("div");
      myDiv.style.whiteSpace = "pre-wrap";
      myDiv.style.width = "671.7px";
      myDiv.style.height = "840px";
      myDiv.style.fontSize = "$size-sm";
      myDiv.style.fontFamily = "Lato, sans-serif";
      myDiv.style.overflow = "scroll";
      myDiv.style.padding = "5px 10px";
      myDiv.style.textAlign = "justify";
      document.body.appendChild(myDiv);
      let i = 0;
      while (
        myDiv.scrollHeight === myDiv.clientHeight &&
        i < wordArray.length
      ) {
        myDiv.textContent += wordArray[i] + " ";
        i++;
      }
      document.body.removeChild(myDiv);
      mainbody = wordArray.slice(0, i - 1).join(" ");
      const additionalArray = wordArray.slice(i - 1);
      additionalArray[0] = additionalArray[0].replace(/^\n+/, "");
      additionalPages = [0];
      additionalbodies = [additionalArray.join(" ")];
      //AdditionalPages
      let wordArrayAdditional = additionalArray;
      let counter = 1;
      while (wordArrayAdditional.length) {
        //Create an overflow test div
        const myDivAdditional = document.createElement("div");
        myDivAdditional.style.whiteSpace = "pre-wrap";
        myDivAdditional.style.width = "671px";
        myDivAdditional.style.height = "840px";
        myDivAdditional.style.fontSize = "$size-sm";
        myDivAdditional.style.fontFamily = "Lato, sans-serif";
        myDivAdditional.style.overflow = "scroll";
        myDivAdditional.style.padding = "5px 10px";
        myDivAdditional.style.textAlign = "justify";
        document.body.appendChild(myDivAdditional);
        let j = 0;
        //tant qu'il n'y a pas d'overflow on ajoute des mots jusqu'à la fin de wordArrayAdditional
        while (
          myDivAdditional.scrollHeight === myDivAdditional.clientHeight &&
          j < wordArrayAdditional.length
        ) {
          myDivAdditional.textContent += wordArrayAdditional[j] + " ";
          j++;
        }
        document.body.removeChild(myDivAdditional);
        if (j === wordArrayAdditional.length) {
          //il n'y a pas eu d'overflow
          wordArrayAdditional = [];
        } else {
          //il y a eu overflow
          additionalbodies[counter - 1] = wordArrayAdditional
            .slice(0, j)
            .join(" ");
          const newWorldArrayAdditional = wordArrayAdditional.slice(j - 1);
          newWorldArrayAdditional[0] = newWorldArrayAdditional[0].replace(
            /^\n+/,
            ""
          );
          additionalbodies[counter] = newWorldArrayAdditional.join(" ");
          wordArrayAdditional = additionalbodies[counter].split(" ");
          additionalPages.push(counter);
          counter++;
        }
      }
      setRecordInfosMainBody(mainbody);
      setRecordInfosAdditionalBodies(additionalbodies);
      setRecordInfosPages(additionalPages);
    }
  }, [
    recordInfosBodyRef,
    setRecordInfosAdditionalBodies,
    setRecordInfosMainBody,
    setRecordInfosPages,
  ]);
};

export default useRecordInfosMultipage;
