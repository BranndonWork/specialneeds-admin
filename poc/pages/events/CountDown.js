import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";

const CountDown = ({ event }) => {
  const [action, setAction] = useState({});
  const [countdown, setCountdown] = useState({
    days: "",
    hours: "",
    minutes: "",
    seconds: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const intervalId = setInterval(updateEventCountdown, 1000);
    updateEventCountdown();

    return () => {
      setAction({});
      clearInterval(intervalId);
    };
  }, [event, updateEventCountdown]);

  const getEventStatus = useCallback(() => {
    const now = new Date();
    const startTime = new Date(event.starts_at);
    const endTime = new Date(event.ends_at);

    const hasStarted = now >= startTime;
    const hasEnded = now >= endTime;

    return { hasStarted, hasEnded };
  }, [event]);

  const countDown = (fromDate, toDate) => {
    if (!fromDate || !toDate) return;

    const duration = moment.duration(moment(toDate).diff(moment(fromDate)));
    setCountdown({
      days: duration.days(),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    });
  };

  const updateEventCountdown = useCallback(() => {
    if (!event.starts_at) return;

    if (getEventStatus().hasEnded) {
      setAction({ action: "ended" });
      return;
    }

    let action = "coming-soon";
    let countdown = event.starts_at;

    if (getEventStatus().hasStarted) {
      action = "in-progress";
      countdown = event.ends_at;
    }

    console.log("action", action);

    setAction({ action: action });
    countDown(new Date(), countdown);
  }, [event, getEventStatus]);

  return (
    <div className="events-details-header">
      {action.action === "coming-soon" && (
        <div className="flex-wrap d-flex justify-content-center">
          <strong>The event starts in:</strong>
        </div>
      )}

      {action.action === "in-progress" && (
        <div className="flex-wrap d-flex justify-content-center">
          <strong>The event has started! It will end in:</strong>
        </div>
      )}

      {action.action === "ended" ? (
        <div className="flex-wrap d-flex justify-content-center">
          <strong>This event has come to an end. Stay connected for more events.</strong>
        </div>
      ) : (
        <div id="timer" className="flex-wrap d-flex justify-content-center">
          {action.action !== "ended" && (
            <>
              <div
                id="days"
                className="align-items-center flex-column d-flex justify-content-center"
              >
                {countdown.days} <span>DAYS</span>
              </div>
              <div
                id="hours"
                className="align-items-center flex-column d-flex justify-content-center"
              >
                {countdown.hours} <span>HOURS</span>
              </div>
              <div
                id="minutes"
                className="align-items-center flex-column d-flex justify-content-center"
              >
                {countdown.minutes} <span>MINUTES</span>
              </div>
              <div
                id="seconds"
                className="align-items-center flex-column d-flex justify-content-center"
              >
                {countdown.seconds} <span>SECONDS</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};


export default CountDown;
