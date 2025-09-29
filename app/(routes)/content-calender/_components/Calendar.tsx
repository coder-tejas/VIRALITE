import React, { useEffect, useRef } from "react";
import { createCalendar, destroyCalendar, DayGrid } from "@event-calendar/core";
// @ts-ignore
import "@event-calendar/core/index.css";

const MyCalendar = ({ calendarData }: { calendarData: any[] }) => {
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const ecInstance = useRef<ReturnType<typeof createCalendar> | null>(null);

  useEffect(() => {
    if (!calendarRef.current) return;

    // destroy previous instance if exists
    if (ecInstance.current) {
      destroyCalendar(ecInstance.current);
      ecInstance.current = null;
    }

    // create new calendar
    ecInstance.current = createCalendar(calendarRef.current, [DayGrid], {
      view: "dayGridMonth",
      events: calendarData || [], // <-- pass the array directly
      editable: true,
      headerToolbar: {
        start: "title",
        center: "",
        end: "prev,next today",
      },
    });

    return () => {
      if (ecInstance.current) destroyCalendar(ecInstance.current);
    };
  }, [calendarData]);

  return (
    <div
      ref={calendarRef}
      style={{ height: "600px", width: "100%", border: "1px solid #ddd" }}
    />
  );
};

export default MyCalendar;
