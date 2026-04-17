import moment from "moment";

export const formatNumber = (number, locale = "en-US") =>
  new Intl.NumberFormat(locale).format(number);

export const formatCurrency = (value, locale = "en-US", currency = "USD") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);

export const formatPercent = (value, fractionDigits = 2, locale = "en-US") =>
  new Intl.NumberFormat(locale, { style: "percent", minimumFractionDigits: fractionDigits }).format(
    value
  );

export const formatDate = (value, format = "YYYY-MM-DD", locale = "en-US") =>
  moment(value).locale(locale).format(format);

export const formatTime = (value, format = "HH:mm", locale = "en-US") =>
  moment(value).locale(locale).format(format);

export const formatDateTime = (value, format = "YYYY-MM-DD HH:mm", locale = "en-US") =>
  moment(value).locale(locale).format(format);
