import { toast } from "react-toastify";
import xanoPut from "../../../../api/xanoCRUD/xanoPut";
import useUserContext from "../../../../hooks/context/useUserContext";

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
  selectAllDisabled,
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
  const handleClickSelectAll = async (e) => {
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
  const handleClickFold = (e) => {
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

  const handleChangeOrder = async (e) => {
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
        <label htmlFor="search">
          <strong>Search</strong>
        </label>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          id="search"
          placeholder="By content, author..."
        />
      </div>
      <div className="clinical-notes__toolbar-order">
        Most recent on:
        <span
          onClick={handleChangeOrder}
          style={{ opacity: addVisible && "0.3" }}
        >
          {order === "asc" ? (
            <i
              className="fa-solid fa-arrow-down"
              style={{
                marginLeft: "5px",
                marginRight: "2px",
                cursor: "pointer",
              }}
            ></i>
          ) : (
            <i
              className="fa-solid fa-arrow-up"
              style={{
                marginLeft: "5px",
                marginRight: "2px",
                cursor: "pointer",
              }}
            ></i>
          )}
          {order === "asc" ? "Bottom" : "Top"}
        </span>
      </div>
      <div className="clinical-notes__toolbar-goto">
        <i
          className="fa-solid fa-angles-up"
          style={{
            marginLeft: "5px",
            marginRight: "2px",
            cursor: "pointer",
          }}
          onClick={handleGoToTop}
        />
        <i
          className="fa-solid fa-angles-down"
          style={{
            marginRight: "2px",
            cursor: "pointer",
          }}
          onClick={handleGoToEnd}
        />
      </div>
      <div className="clinical-notes__toolbar-btn-container">
        <button onClick={handleClickFold}>
          {contentsVisible ? "Fold" : "Unfold"}
        </button>
        <button
          onClick={handleClickOverview}
          disabled={overviewVisible || isPending}
        >
          Overview
        </button>
        <button
          onClick={handleClickNew}
          disabled={addVisible || newButtonDisabled || isPending}
        >
          New
        </button>
        <button
          onClick={handleClickPrint}
          disabled={checkedNotes.length === 0 || isPending}
        >
          Print Selection
        </button>
        <button
          onClick={handleClickSelectAll}
          disabled={isPending || !clinicalNotes.length}
        >
          {selectAll ? "Unselect All" : "Select All"}
        </button>
      </div>
    </div>
  );
};

export default ClinicalNotesToolBar;
