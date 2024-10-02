import { useEffect } from "react";

const useLetterMultipage = (
  bodyRef: React.MutableRefObject<HTMLTextAreaElement | null>,
  body: string,
  setMainBody: React.Dispatch<React.SetStateAction<string>>,
  setAdditionalBodies: React.Dispatch<React.SetStateAction<string[]>>,
  setPages: React.Dispatch<React.SetStateAction<number[]>>
) => {
  useEffect(() => {
    if (bodyRef.current) {
      if (bodyRef.current.scrollHeight > bodyRef.current.clientHeight) {
        let additionalPages: number[] = [];
        let mainbody = "";
        let additionalbodies: string[] = [];
        //Main page (page -1)
        const wordArray = body.split(" "); //All the words
        //Create an overflow test div
        const myDiv = document.createElement("div");
        myDiv.style.whiteSpace = "pre-wrap";
        myDiv.style.width = "671.7px";
        myDiv.style.height = "440px";
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
          myDivAdditional.style.width = "671.7px";
          myDivAdditional.style.height = "840px";
          myDivAdditional.style.fontSize = "$size-sm";
          myDivAdditional.style.fontFamily = "Lato, sans-serif";
          myDivAdditional.style.overflow = "scroll";
          myDivAdditional.style.padding = "5px 10px";
          myDivAdditional.style.textAlign = "justify";
          document.body.appendChild(myDivAdditional);
          let j = 0;
          //While no overflow add words until wordArrayAdditional end
          while (
            myDivAdditional.scrollHeight === myDivAdditional.clientHeight &&
            j < wordArrayAdditional.length
          ) {
            myDivAdditional.textContent += wordArrayAdditional[j] + " ";
            j++;
          }
          document.body.removeChild(myDivAdditional);
          if (j === wordArrayAdditional.length) {
            //overflow
            wordArrayAdditional = [];
          } else {
            //no overflow
            additionalbodies[counter - 1] = wordArrayAdditional
              .slice(0, j - 1)
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
        setMainBody(mainbody);
        setAdditionalBodies(additionalbodies);
        setPages(additionalPages);
      }
    }
  }, [body, bodyRef, setAdditionalBodies, setMainBody, setPages]);
};

export default useLetterMultipage;
