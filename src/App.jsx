import React, { useState, useEffect } from "react";

const App = () => {
  const [clockInTime, setClockInTime] = useState("");
  const [lunchDuration, setLunchDuration] = useState(30); 
  const [knockOffTime, setKnockOffTime] = useState("");
  const [isKnockOffTime, setIsKnockOffTime] = useState(false);

  useEffect(() => {
    const savedClockInTime = localStorage.getItem("clockInTime");
    if (savedClockInTime) {
      setClockInTime(savedClockInTime);
      calculateKnockOffTime(savedClockInTime, lunchDuration);
    }
  }, []);

  const calculateKnockOffTime = (time, duration) => {
    if (!time) return;

    const [hours, minutes] = time.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + 8 * 60 + duration; 
    const knockOffHours = Math.floor(totalMinutes / 60) % 24;
    const knockOffMinutes = totalMinutes % 60;

    const formattedKnockOffTime = `${String(knockOffHours).padStart(2, "0")}:${String(
      knockOffMinutes
    ).padStart(2, "0")}`;
    setKnockOffTime(formattedKnockOffTime);
  };

  const handleClockInTimeChange = (e) => {
    const time = e.target.value;
    setClockInTime(time);
    localStorage.setItem("clockInTime", time);
    calculateKnockOffTime(time, lunchDuration);
  };

  const handleLunchDurationChange = (e) => {
    const duration = parseInt(e.target.value, 10);
    setLunchDuration(duration);
    calculateKnockOffTime(clockInTime, duration);
  };

  // Check if it's knock-off time
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;

      if (currentTime === knockOffTime ) {
        setIsKnockOffTime(true);
        new Audio("/beep.mp3").play(); // Play sound
      } else {
        setIsKnockOffTime(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [knockOffTime]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Knock-Off Time Calculator</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Clock-In Time</label>
            <input
              type="time"
              value={clockInTime}
              onChange={handleClockInTimeChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Lunch Duration</label>
            <select
              value={lunchDuration}
              onChange={handleLunchDurationChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
            </select>
          </div>

          <div className="text-center">
            <p className="text-lg font-semibold">
              Knock-Off Time:{" "}
              <span className="text-blue-600">{knockOffTime || "--:--"}</span>
            </p>
          </div>

          {isKnockOffTime && (
            <div className="text-center mt-4">
              <p className="text-red-600 font-bold">It's knock-off time! 🎉</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;