import xanoGet from "../../api/xanoCRUD/xanoGet";
import xanoPut from "../../api/xanoCRUD/xanoPut";
import { AvailabilityType } from "../../types/api";

export const reinitializeAvailabilities = async (staffIds: number[]) => {
  try {
    for (const staffId of staffIds) {
      const availability: AvailabilityType = await xanoGet(
        "/availability_of_staff",
        "staff",
        {
          staff_id: staffId,
        }
      );
      const availabilityToPut: Partial<AvailabilityType> = {
        ...availability,
        schedule_morning: {
          monday: [
            {
              hours: "09",
              min: "00",
              ampm: "AM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
            {
              hours: "12",
              min: "00",
              ampm: "PM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
          ],
          tuesday: [
            {
              hours: "09",
              min: "00",
              ampm: "AM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
            {
              hours: "12",
              min: "00",
              ampm: "PM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
          ],
          wednesday: [
            {
              hours: "09",
              min: "00",
              ampm: "AM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
            {
              hours: "12",
              min: "00",
              ampm: "PM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
          ],
          thursday: [
            {
              hours: "09",
              min: "00",
              ampm: "AM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
            {
              hours: "12",
              min: "00",
              ampm: "PM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
          ],
          friday: [
            {
              hours: "09",
              min: "00",
              ampm: "AM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
            {
              hours: "12",
              min: "00",
              ampm: "PM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
          ],
          saturday: [
            {
              hours: "09",
              min: "00",
              ampm: "AM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
            {
              hours: "12",
              min: "00",
              ampm: "PM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
          ],
          sunday: [
            {
              hours: "09",
              min: "00",
              ampm: "AM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
            {
              hours: "12",
              min: "00",
              ampm: "PM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
          ],
        },
        schedule_afternoon: {
          monday: [
            {
              hours: "01",
              min: "00",
              ampm: "PM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
            {
              hours: "04",
              min: "00",
              ampm: "PM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
          ],
          tuesday: [
            {
              hours: "01",
              min: "00",
              ampm: "PM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
            {
              hours: "04",
              min: "00",
              ampm: "PM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
          ],
          wednesday: [
            {
              hours: "01",
              min: "00",
              ampm: "PM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
            {
              hours: "04",
              min: "00",
              ampm: "PM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
          ],
          thursday: [
            {
              hours: "01",
              min: "00",
              ampm: "PM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
            {
              hours: "04",
              min: "00",
              ampm: "PM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
          ],
          friday: [
            {
              hours: "01",
              min: "00",
              ampm: "PM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
            {
              hours: "04",
              min: "00",
              ampm: "PM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
          ],
          saturday: [
            {
              hours: "01",
              min: "00",
              ampm: "PM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
            {
              hours: "04",
              min: "00",
              ampm: "PM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
          ],
          sunday: [
            {
              hours: "01",
              min: "00",
              ampm: "PM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
            {
              hours: "04",
              min: "00",
              ampm: "PM",
              appointment_modes: ["in-person", "visio", "phone"],
            },
          ],
        },
        default_duration_hours: 1,
        default_duration_min: 0,
      };
      const response = await xanoPut(
        `/availability/${availability.id}`,
        "staff",
        availabilityToPut
      );
      console.log(
        `Reinitialized availability for staff ID ${staffId}:`,
        response
      );
    }
  } catch (err) {
    console.error("Error fetching availability:", err);
    throw new Error("Failed to fetch availability data");
  }
};
export const populateAppointmentModes = async (staffIds: number[]) => {
  try {
    for (const staffId of staffIds) {
      const availability: AvailabilityType = await xanoGet(
        "/availability_of_staff",
        "staff",
        {
          staff_id: staffId,
        }
      );

      const availabilityToPut: AvailabilityType = {
        ...availability,
        schedule_morning: {
          monday: availability.schedule_morning.monday.map((slot) => ({
            ...slot,
            appointment_modes: ["in-person", "visio", "phone"],
          })),
          tuesday: availability.schedule_morning.tuesday.map((slot) => ({
            ...slot,
            appointment_modes: ["in-person", "visio", "phone"],
          })),
          wednesday: availability.schedule_morning.wednesday.map((slot) => ({
            ...slot,
            appointment_modes: ["in-person", "visio", "phone"],
          })),
          thursday: availability.schedule_morning.thursday.map((slot) => ({
            ...slot,
            appointment_modes: ["in-person", "visio", "phone"],
          })),
          friday: availability.schedule_morning.friday.map((slot) => ({
            ...slot,
            appointment_modes: ["in-person", "visio", "phone"],
          })),
          saturday: availability.schedule_morning.saturday.map((slot) => ({
            ...slot,
            appointment_modes: ["in-person", "visio", "phone"],
          })),
          sunday: availability.schedule_morning.sunday.map((slot) => ({
            ...slot,
            appointment_modes: ["in-person", "visio", "phone"],
          })),
        },
        schedule_afternoon: {
          monday: availability.schedule_afternoon.monday.map((slot) => ({
            ...slot,
            appointment_modes: ["in-person", "visio", "phone"],
          })),
          tuesday: availability.schedule_afternoon.tuesday.map((slot) => ({
            ...slot,
            appointment_modes: ["in-person", "visio", "phone"],
          })),
          wednesday: availability.schedule_afternoon.wednesday.map((slot) => ({
            ...slot,
            appointment_modes: ["in-person", "visio", "phone"],
          })),
          thursday: availability.schedule_afternoon.thursday.map((slot) => ({
            ...slot,
            appointment_modes: ["in-person", "visio", "phone"],
          })),
          friday: availability.schedule_afternoon.friday.map((slot) => ({
            ...slot,
            appointment_modes: ["in-person", "visio", "phone"],
          })),
          saturday: availability.schedule_afternoon.saturday.map((slot) => ({
            ...slot,
            appointment_modes: ["in-person", "visio", "phone"],
          })),
          sunday: availability.schedule_afternoon.sunday.map((slot) => ({
            ...slot,
            appointment_modes: ["in-person", "visio", "phone"],
          })),
        },
      };

      const response = await xanoPut(
        `/availability/${availability.id}`,
        "staff",
        availabilityToPut
      );
    }
  } catch (err) {
    console.error("Error fetching availability:", err);
    throw new Error("Failed to fetch availability data");
  }
};
