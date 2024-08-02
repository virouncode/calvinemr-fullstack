import ClinicalNotesTitle from "./ClinicalNotesTitle";
import ClinicalNotesToolBar from "./ClinicalNotesToolBar";

const ClinicalNotesHeader = ({
  demographicsInfos,
  notesVisible,
  setNotesVisible,
  contentsVisible,
  setContentsVisible,
  contentRef,
  triangleRef,
  addVisible,
  setAddVisible,
  search,
  setSearch,
  checkedNotes,
  setCheckedNotes,
  checkAllNotes,
  setPrintVisible,
  selectAll,
  setSelectAll,
  order,
  setOrder,
  loadingPatient,
  errPatient,
  overviewVisible,
  setOverviewVisible,
  newButtonDisabled,
  topRef,
  endRef,
  goToEnd,
  goToTop,
  setGoToEnd,
  setGoToTop,
  isPending,
  fetchNextPage,
  setNewMessageVisible,
  clinicalNotes,
}) => {
  return (
    <div className="clinical-notes__header">
      <ClinicalNotesTitle
        demographicsInfos={demographicsInfos}
        notesVisible={notesVisible}
        setNotesVisible={setNotesVisible}
        contentRef={contentRef}
        triangleRef={triangleRef}
        loadingPatient={loadingPatient}
        errPatient={errPatient}
        setNewMessageVisible={setNewMessageVisible}
      />
      <ClinicalNotesToolBar
        contentsVisible={contentsVisible}
        setContentsVisible={setContentsVisible}
        addVisible={addVisible}
        setAddVisible={setAddVisible}
        search={search}
        setSearch={setSearch}
        contentRef={contentRef}
        triangleRef={triangleRef}
        checkedNotes={checkedNotes}
        setCheckedNotes={setCheckedNotes}
        checkAllNotes={checkAllNotes}
        setPrintVisible={setPrintVisible}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
        order={order}
        setOrder={setOrder}
        overviewVisible={overviewVisible}
        setOverviewVisible={setOverviewVisible}
        newButtonDisabled={newButtonDisabled}
        topRef={topRef}
        endRef={endRef}
        setGoToEnd={setGoToEnd}
        setGoToTop={setGoToTop}
        goToTop={goToTop}
        goToEnd={goToEnd}
        isPending={isPending}
        fetchNextPage={fetchNextPage}
        setNotesVisible={setNotesVisible}
        clinicalNotes={clinicalNotes}
      />
    </div>
  );
};

export default ClinicalNotesHeader;
