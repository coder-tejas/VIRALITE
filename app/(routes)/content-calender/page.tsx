"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { FormModal } from "./_components/FormModal";
import Calendar from "./_components/Calendar";
import axios from "axios";
import { getRunOutput } from "@/services/GlobalApi";

function ContentCalender() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [calendarData, setCalenderData] = useState() as any[];
  const generateCalender = async (formValues: {
    ContentType: string;
    AgeGroup: string;
    Location: string;
    Goals: string;
    PostingFrequency: string;
  }) => {
    setLoading(true);
    console.log("🔄 Starting AI content generation...");
    // console.log("form data ---> ", formValues);

    const result = await axios.post("/api/ai-content-calender", {
      userInput: formValues,
    });
    console.log("✅ API Response", result.data);

    // setShowCalendar(true); // show the calendar after generation
    const jobId = result.data.jobId;
    if (!jobId) throw new Error("No job id returned from API");
    console.log("🔄 Job started with ID:", jobId);
    try {
      const completedRun = await getRunOutput(jobId);
      if (completedRun && completedRun.output) {
        const output = completedRun.output;
        const eventsArray = output.events ?? [];
        setCalenderData(eventsArray);
        setShowCalendar(true);
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">
          AI Content Calendar
        </h1>
        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
          Lorem ipsum dolor sit amet consectetur adipisicing elit…
        </p>

        {!showCalendar && (
          <div className="flex justify-center">
            <div className="w-full max-w-3xl">
              {/* Pass generateCalender directly to FormModal */}
              <FormModal OnSubmit={generateCalender} />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-8">
        {showCalendar && (
          <div className="w-full">
            <div className="bg-gray-50 p-6 rounded-2xl shadow-sm w-full">
              <Calendar calendarData={calendarData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContentCalender;
