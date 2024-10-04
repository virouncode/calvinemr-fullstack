import { useMediaQuery } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import NewWindow from "react-new-window";
import { useClinicalNotes } from "../../../../hooks/reactquery/queries/clinicalNotesQueries";
import useIntersection from "../../../../hooks/useIntersection";
import useRetrieveEditClinicalNote from "../../../../hooks/useRetrieveEditClinicalNote";
import useRetrieveNewClinicalNote from "../../../../hooks/useRetrieveNewClinicalNote";
import { ClinicalNoteType, DemographicsType } from "../../../../types/api";
import { toPatientName } from "../../../../utils/names/toPatientName";
import ErrorParagraph from "../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import NewMessageExternal from "../../Messaging/External/NewMessageExternal";
import NewMessageExternalMobile from "../../Messaging/External/NewMessageExternalMobile";
import ClinicalNoteCard from "./Card/ClinicalNoteCard";
import ClinicalNoteForm from "./Card/ClinicalNoteForm";
import ClinicalNotesHeader from "./ClinicalNotesHeader";
import LoadingClinical from "./LoadingClinical";
import ClinicalNotesOverview from "./Overview/ClinicalNotesOverview";
import ClinicalNotesPrint from "./Print/ClinicalNotesPrint";

type ClinicalNotesProps = {
  demographicsInfos: DemographicsType;
  notesVisible: boolean;
  setNotesVisible: React.Dispatch<React.SetStateAction<boolean>>;
  contentsVisible: boolean;
  setContentsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  patientId: number;
};

const ClinicalNotes = ({
  demographicsInfos,
  notesVisible,
  setNotesVisible,
  contentsVisible,
  setContentsVisible,
  patientId,
}: ClinicalNotesProps) => {
  //Hooks
  const [checkedNotesIds, setCheckedNotesIds] = useState<number[]>([]);
  const [printVisible, setPrintVisible] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [overviewVisible, setOverviewVisible] = useState(false);
  const [newButtonDisabled, setNewButtonDisabled] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [order, setOrder] = useState<"asc" | "desc">(
    JSON.parse(localStorage.getItem("user") as string).settings
      .clinical_notes_order
  );
  const [search, setSearch] = useState("");
  const [goToEnd, setGoToEnd] = useState(false);
  const [newMessageVisible, setNewMessageVisible] = useState(false);
  const triangleRef = useRef<SVGSVGElement | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  //Queries
  const {
    data: clinicalNotes,
    isPending,
    error,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
    hasNextPage,
  } = useClinicalNotes(patientId, search, order);

  const { newClinicalNoteInMemory, setNewClinicalNoteInMemory } =
    useRetrieveNewClinicalNote(patientId, setAddVisible);
  const { editClinicalNoteInMemory, setEditClinicalNoteInMemory } =
    useRetrieveEditClinicalNote(patientId, fetchNextPage, clinicalNotes);
  const isTabletOrMobile = useMediaQuery("(max-width: 1024px)");

  //Intersection observer
  const { divRef: contentRef, lastItemRef } = useIntersection(
    isFetchingNextPage,
    fetchNextPage,
    isFetching
  );

  useEffect(() => {
    if (addVisible && formRef.current) {
      formRef.current.scrollIntoView();
    }
  }, [addVisible, formRef]);

  useEffect(() => {
    if (goToEnd && endRef.current && !isFetchingNextPage) {
      endRef.current.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    }
  }, [goToEnd, isFetchingNextPage]);

  const checkAllNotes = () => {
    const allNotesIds =
      clinicalNotes?.pages.flatMap((page) => page.items).map(({ id }) => id) ??
      [];
    setCheckedNotesIds(allNotesIds);
  };

  if (error)
    return (
      <div className="clinical-notes">
        <ErrorParagraph errorMsg={error.message} />
      </div>
    );

  return (
    <div className="clinical-notes">
      <ClinicalNotesHeader
        demographicsInfos={demographicsInfos}
        notesVisible={notesVisible}
        setNotesVisible={setNotesVisible}
        contentsVisible={contentsVisible}
        setContentsVisible={setContentsVisible}
        contentRef={contentRef}
        triangleRef={triangleRef}
        addVisible={addVisible}
        setAddVisible={setAddVisible}
        search={search}
        setSearch={setSearch}
        checkedNotesIds={checkedNotesIds}
        setCheckedNotesIds={setCheckedNotesIds}
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
        isPending={isPending}
        fetchNextPage={fetchNextPage}
        setNewMessageVisible={setNewMessageVisible}
        clinicalNotes={
          clinicalNotes?.pages?.flatMap(
            (page) => page.items
          ) as ClinicalNoteType[]
        }
      />
      {printVisible && (
        <NewWindow
          title="Patient clinical notes"
          features={{
            toolbar: "no",
            scrollbars: "no",
            menubar: "no",
            status: "no",
            directories: "no",
            width: 793.7,
            height: 1122.5,
            left: 320,
            top: 200,
          }}
          onUnload={() => setPrintVisible(false)}
        >
          <ClinicalNotesPrint
            demographicsInfos={demographicsInfos}
            clinicalNotes={
              clinicalNotes?.pages.flatMap((page) => page.items) ?? []
            }
            checkedNotesIds={checkedNotesIds}
            selectAll={selectAll}
            isPending={isPending}
            error={error}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
          />
        </NewWindow>
      )}
      {overviewVisible && (
        <FakeWindow
          title={`CLINICAL NOTES OVERVIEW`}
          width={1024}
          height={600}
          x={(window.innerWidth - 1024) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#8fb4fb"
          setPopUpVisible={setOverviewVisible}
        >
          <ClinicalNotesOverview
            clinicalNotes={
              clinicalNotes?.pages.flatMap((page) => page.items) ?? []
            }
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            isFetching={isFetching}
          />
        </FakeWindow>
      )}
      {isPending ? (
        <div style={{ marginTop: "40px" }}>
          <LoadingParagraph />
        </div>
      ) : (
        <div
          className={
            notesVisible
              ? "clinical-notes__content clinical-notes__content--active"
              : "clinical-notes__content"
          }
          ref={contentRef}
        >
          <div ref={topRef}></div>
          {addVisible && order === "desc" && (
            <ClinicalNoteForm
              setAddVisible={setAddVisible}
              patientId={patientId}
              demographicsInfos={demographicsInfos}
              formRef={formRef}
              newClinicalNoteInMemory={newClinicalNoteInMemory}
              setNewClinicalNoteInMemory={setNewClinicalNoteInMemory}
            />
          )}
          {clinicalNotes.pages.flatMap((page) => page.items).length > 0 ? (
            clinicalNotes.pages
              .flatMap((page) => page.items)
              .map((item, index) =>
                index ===
                clinicalNotes.pages.flatMap((page) => page.items).length - 1 ? (
                  <ClinicalNoteCard
                    clinicalNote={item}
                    clinicalNotes={clinicalNotes.pages.flatMap(
                      (page) => page.items
                    )}
                    patientId={patientId}
                    key={item.id}
                    checkedNotesIds={checkedNotesIds}
                    setCheckedNotesIds={setCheckedNotesIds}
                    setSelectAll={setSelectAll}
                    selectAll={selectAll}
                    contentsVisible={contentsVisible}
                    demographicsInfos={demographicsInfos}
                    lastItemRef={lastItemRef}
                    addVisible={addVisible}
                    editClinicalNoteInMemory={
                      editClinicalNoteInMemory?.id === item.id
                        ? editClinicalNoteInMemory
                        : null
                    }
                    setEditClinicalNoteInMemory={setEditClinicalNoteInMemory}
                    setNewButtonDisabled={setNewButtonDisabled}
                  />
                ) : (
                  <ClinicalNoteCard
                    clinicalNote={item}
                    clinicalNotes={clinicalNotes.pages.flatMap(
                      (page) => page.items
                    )}
                    patientId={patientId}
                    key={item.id}
                    checkedNotesIds={checkedNotesIds}
                    setCheckedNotesIds={setCheckedNotesIds}
                    setSelectAll={setSelectAll}
                    selectAll={selectAll}
                    contentsVisible={contentsVisible}
                    demographicsInfos={demographicsInfos}
                    editClinicalNoteInMemory={
                      editClinicalNoteInMemory?.id === item.id
                        ? editClinicalNoteInMemory
                        : null
                    }
                    setEditClinicalNoteInMemory={setEditClinicalNoteInMemory}
                    addVisible={addVisible}
                    setNewButtonDisabled={setNewButtonDisabled}
                  />
                )
              )
          ) : (
            <div style={{ padding: "5px" }}>No clinical notes</div>
          )}
          {isFetchingNextPage && <LoadingClinical />}
          <div ref={endRef}></div>
          {addVisible && order === "asc" && (
            <ClinicalNoteForm
              setAddVisible={setAddVisible}
              patientId={patientId}
              demographicsInfos={demographicsInfos}
              formRef={formRef}
              newClinicalNoteInMemory={newClinicalNoteInMemory}
              setNewClinicalNoteInMemory={setNewClinicalNoteInMemory}
            />
          )}
        </div>
      )}
      {newMessageVisible && (
        <FakeWindow
          title={`NEW MESSAGE TO ${toPatientName(demographicsInfos)}`}
          width={1000}
          height={630}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 630) / 2}
          color={"#848484"}
          setPopUpVisible={setNewMessageVisible}
        >
          {isTabletOrMobile ? (
            <NewMessageExternalMobile
              setNewVisible={setNewMessageVisible}
              initialRecipients={[
                {
                  id: patientId,
                  name: toPatientName(demographicsInfos),
                  email: demographicsInfos.Email,
                  phone:
                    demographicsInfos.PhoneNumber?.find(
                      ({ _phoneNumberType }) => _phoneNumberType === "C"
                    )?.phoneNumber || "",
                },
              ]}
            />
          ) : (
            <NewMessageExternal
              setNewVisible={setNewMessageVisible}
              initialRecipients={[
                {
                  id: patientId,
                  name: toPatientName(demographicsInfos),
                  email: demographicsInfos.Email,
                  phone:
                    demographicsInfos.PhoneNumber?.find(
                      ({ _phoneNumberType }) => _phoneNumberType === "C"
                    )?.phoneNumber || "",
                },
              ]}
            />
          )}
        </FakeWindow>
      )}
    </div>
  );
};

export default ClinicalNotes;
