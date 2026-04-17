import moment from "moment-timezone";

export const eventDateInfo = (event, options = {}) => {
  if (!event.starts_at || !event.ends_at) return;
  const default_options = {
    dateFormat: "short",
    alwaysShowYear: false,
    weekday: true,
    time: false,
  };
  options = { ...default_options, ...options };

  const localTimeZone = moment.tz.guess();

  event.starts_at = moment(event.starts_at).tz(localTimeZone).format();
  event.ends_at = moment(event.ends_at).tz(localTimeZone).format();

  const startsAt = moment(event.starts_at);
  const endsAt = moment(event.ends_at);
  const now = moment();

  const alwaysShowYear = options.alwaysShowYear ?? false;
  const optionsTime = options.time ?? false;
  const dateFormat = options.dateFormat === "short" ? "MMM D" : "MMMM D";

  let startDateFormat = dateFormat;
  let endDateFormat = dateFormat;
  if (options.weekday) {
    startDateFormat = "ddd, " + dateFormat;
    endDateFormat = "ddd, " + dateFormat;
  }

  let dateString = "";
  const sameDay = startsAt.isSame(endsAt, "day");
  const showTime = optionsTime || sameDay;

  dateString += startsAt.format(startDateFormat);
  if (
    options.year ||
    alwaysShowYear ||
    startsAt.year() !== endsAt.year() ||
    startsAt.year() !== now.year()
  ) {
    dateString += `, ${startsAt.year()}`;
  }

  if (showTime && !sameDay) {
    let startFormat = startsAt.format("mm") == "00" ? "h A" : "h:mm A";
    dateString += ` @ ${startsAt.format(startFormat)}`;
  }

  dateString += " to";

  if (!sameDay) {
    dateString += ` ${endsAt.format(endDateFormat)}`;
    if (options.year || alwaysShowYear || endsAt.year() !== now.year()) {
      dateString += `, ${endsAt.year()}`;
    }

    if (showTime) {
      let endFormat = endsAt.format("mm") == "00" ? "h A" : "h:mm A";
      dateString += ` @ ${endsAt.format(endFormat)}`;
    }
  }

  return dateString;
};
