import { useEffect } from "react";

function useSaveScrollPosition(currentView: string) {
  useEffect(() => {
    const scrollGrid = document.querySelector(
      ".fc-scroller.fc-scroller-liquid-absolute"
    );

    // petite fonction@ debounce maison
    const debounce = (func: () => void, delay: number) => {
      let timer: number;
      return () => {
        clearTimeout(timer);
        timer = setTimeout(() => func(), delay);
      };
    };

    const saveScrollPosition = () => {
      if (scrollGrid) {
        const pos = scrollGrid.scrollTop;
        localStorage.setItem("calendarScrollPosition", pos.toString());
      }
    };

    // On debounce la sauvegarde pour éviter de spammer le localStorage
    const debouncedSave = debounce(saveScrollPosition, 200); // 200 ms de délai

    if (
      scrollGrid &&
      currentView !== "dayGridMonth" &&
      currentView !== "multiMonthYear" &&
      currentView !== "listWeek"
    ) {
      scrollGrid.addEventListener("scroll", debouncedSave);
    }

    // Cleanup
    return () => {
      if (scrollGrid) {
        scrollGrid.removeEventListener("scroll", debouncedSave);
      }
    };
  }, [currentView]);
}

export default useSaveScrollPosition;
