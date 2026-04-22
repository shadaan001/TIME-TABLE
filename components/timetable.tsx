"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface TimetableRow {
  id: string;
  class: string;
  day: string;
  slot: string | null;
  subject: string;
  teacher: string | null;
  time: string | null;
}

interface TimetableProps {
  className: string;
}

export default function Timetable({ className }: TimetableProps) {
  const [data, setData] = useState<TimetableRow[]>([]);

  useEffect(() => {
    fetchData();
  }, [className]);

  const fetchData = async () => {
    console.log("Fetching class:", className);

    // ✅ FIX: FILTER BY CLASS
    const { data, error } = await supabase
      .from("timetable")
      .select("*")
      .eq("class_name", className); // 🔥 IMPORTANT LINE

    if (error) {
      console.error(error);
    } else {
      console.log("FILTERED DATA:", data);
      setData(data || []);
    }
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">{className}</h2>

      <div className="grid grid-cols-7 gap-5">
        {days.map((day) => {
          // ✅ FILTER BY DAY (ALREADY GOOD)
          const dayData = data
            .filter(
              (item) =>
                item.day?.trim().toLowerCase() === day.toLowerCase()
            )
            .sort((a, b) => {
              const getTime = (slot: string | null) =>
                slot ? parseInt(slot.split(":")[0]) : 0;

              return getTime(a.slot) - getTime(b.slot);
            });

          return (
            <div
              key={day}
              className="bg-purple-900 p-4 rounded-2xl min-h-[160px] flex flex-col shadow-lg"
            >
              <h3 className="font-semibold mb-3 text-white">{day}</h3>

              {dayData.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {dayData.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gradient-to-r from-purple-800 to-purple-700 p-3 rounded-xl shadow-md hover:scale-[1.03] transition-all duration-200"
                    >
                      <p className="font-medium text-white">
                        {item.subject}
                      </p>

                      {(item.slot || item.time) && (
                        <p className="text-xs text-gray-200">
                          {item.slot || item.time}
                        </p>
                      )}

                      {item.teacher && (
                        <p className="text-xs text-gray-300">
                          {item.teacher}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 mt-auto text-sm">—</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}