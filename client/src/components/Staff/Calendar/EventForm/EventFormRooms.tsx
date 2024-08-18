import React from "react";
import { AppointmentType, SiteType } from "../../../../types/api";
import SiteSelect from "../../../UI/Lists/SiteSelect";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";
import RoomsRadio from "./Rooms/RoomsRadio";

type EventFormRoomsProps = {
  formDatas: AppointmentType;
  sites: SiteType[];
  handleSiteChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleRoomChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isRoomOccupied: (roomId: string) => boolean;
  isPending: boolean;
};

const EventFormRooms = ({
  formDatas,
  sites,
  handleSiteChange,
  handleRoomChange,
  isRoomOccupied,
  isPending,
}: EventFormRoomsProps) => {
  return (
    <div className="event-form__row event-form__row--radio">
      <div style={{ marginBottom: "5px" }}>
        <SiteSelect
          label="Site"
          handleSiteChange={handleSiteChange}
          sites={sites}
          value={formDatas.site_id}
        />
      </div>
      {isPending ? (
        <LoadingParagraph />
      ) : (
        <RoomsRadio
          handleRoomChange={handleRoomChange}
          roomSelectedId={formDatas.room_id}
          rooms={
            sites
              .find(({ id }) => id === formDatas.site_id)
              ?.rooms.sort((a, b) => a.id.localeCompare(b.id)) ?? []
          }
          isRoomOccupied={isRoomOccupied}
        />
      )}
    </div>
  );
};

export default EventFormRooms;
