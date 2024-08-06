import { toast } from "react-toastify";
import xanoPut from "../../../../api/xanoCRUD/xanoPut";
import useUserContext from "../../../../hooks/context/useUserContext";
import Button from "../../../UI/Buttons/Button";
import Input from "../../../UI/Inputs/Input";
import ClinicalNotesNavigation from "./ClinicalNotesNavigation";
import OrderPicker from "./OrderPicker";

const ClinicalNotesToolBar = ({
  contentsVisible,
  setContentsVisible,
  addVisible,
  setAddVisible,
  search,
  setSearch,
  contentRef,
  triangleRef,
  checkedNotes,
  setCheckedNotes,
  checkAllNotes,
  setPrintVisible,
  selectAll,
  setSelectAll,
  order,
  setOrder,
  overviewVisible,
  setOverviewVisible,
  newButtonDisabled,
  topRef,
  endRef,
  setGoToEnd,
  isPending,
  fetchNextPage,
  setNotesVisible,
  clinicalNotes,
}) => {
  //HOOKS
  const { user } = useUserContext();

  //Events
  const handleClickOverview = () => {
    setOverviewVisible(true);
  };
  const handleClickSelectAll = async () => {
    if (selectAll) {
      setSelectAll(false);
      setCheckedNotes([]);
    } else {
      checkAllNotes();
      setSelectAll(true);
    }
  };
  const handleClickNew = async () => {
    //If most recent on bottom, we want all the clinical notes to put the form under
    if (order === "asc") {
      let hasMore = true;
      while (hasMore) {
        const { hasNextPage: hasNext } = await fetchNextPage();
        hasMore = hasNext ?? false;
      }
    }
    //Unfold the content
    if (contentRef.current && triangleRef.current) {
      triangleRef.current.classList.add("triangle--active");
      contentRef.current.classList.add("clinical-notes__content--active");
      setNotesVisible(true);
    }
    setAddVisible(true);
  };
  const handleClickFold = () => {
    if (!contentsVisible) {
      triangleRef.current.classList.add("triangle--active");
      contentRef.current.classList.add("clinical-notes__content--active");
    }
    setContentsVisible((v) => !v);
  };
  const handleClickPrint = () => {
    setPrintVisible((v) => !v);
  };
  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (
      triangleRef?.current &&
      !triangleRef.current.classList.contains("triangle--active")
    ) {
      triangleRef.current.classList.add("triangle--active");
    }
    if (
      contentRef?.current &&
      !contentRef.current.classList.contains("clinical-notes__content--active")
    ) {
      contentRef.current.classList.add("clinical-notes__content--active");
    }
  };

  const handleChangeOrder = async () => {
    if (addVisible) return;
    let newOrder;
    if (order === "asc") {
      setOrder("desc");
      newOrder = "desc";
    } else {
      setOrder("asc");
      newOrder = "asc";
    }
    //Change user settitngs
    try {
      const response = await xanoPut(`/settings/${user.settings.id}`, "staff", {
        ...user.settings,
        clinical_notes_order: newOrder,
      });
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, settings: response })
      );
    } catch (err) {
      toast.error(`Error: unable to change order: ${err.message}`, {
        containerId: "A",
      });
    }
  };

  const handleGoToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView();
    }
    setGoToEnd(false);
  };
  const handleGoToEnd = async () => {
    let hasMore = true;
    while (hasMore) {
      const { hasNextPage: hasNext } = await fetchNextPage();
      hasMore = hasNext ?? false;
    }
    setGoToEnd(true);
    if (endRef.current) {
      endRef.current.scrollIntoView();
    }
  };

  return (
    <div className="clinical-notes__toolbar">
      <div className="clinical-notes__toolbar-search">
        <Input
          value={search}
          onChange={handleSearch}
          id="search"
          placeholder="By content, author..."
          label="Search"
        />
      </div>
      <div className="clinical-notes__toolbar-order">
        <OrderPicker
          handleChangeOrder={handleChangeOrder}
          addVisible={addVisible}
          order={order}
        />
      </div>
      <div className="clinical-notes__toolbar-goto">
        <ClinicalNotesNavigation
          handleGoToTop={handleGoToTop}
          handleGoToEnd={handleGoToEnd}
        />
      </div>
      <div className="clinical-notes__toolbar-btn-container">
        <Button
          onClick={handleClickFold}
          label={contentsVisible ? "Fold" : "Unfold"}
        />
        <Button
          onClick={handleClickOverview}
          disabled={overviewVisible || isPending}
          label="Overview"
        />
        <Button
          onClick={handleClickNew}
          disabled={addVisible || newButtonDisabled || isPending}
          label="New"
        />
        <Button
          onClick={handleClickPrint}
          disabled={checkedNotes.length === 0 || isPending}
          label="Print Selection"
        />
        <Button
          onClick={handleClickSelectAll}
          disabled={isPending || !clinicalNotes.length}
          label={selectAll ? "Unselect All" : "Select All"}
        />
      </div>
    </div>
  );
};

export default ClinicalNotesToolBar;
