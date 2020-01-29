import { addHours, startOfDay, endOfDay, formatDistance } from "date-fns";
import deLocale from "date-fns/locale/de";

const OpeningHours = require("./vendor/opening_hours+deps.js");

export type Interval = [Date, Date, boolean, string | undefined];

const nominatimCologne = {
  place_id: 198680158,
  licence:
    "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
  osm_type: "relation",
  osm_id: 62761,
  lat: "51.4785568",
  lon: "7.5533645",
  display_name: "North Rhine-Westphalia, Germany",
  address: {
    state: "North Rhine-Westphalia",
    country: "Germany",
    country_code: "de",
  },
  boundingbox: ["50.322567", "52.5314923", "5.8663153", "9.4617417"],
};

function memoize<A extends unknown[], R>(
  fn: (...args: A) => R,
): (...args: A) => R {
  const cache: { [key: string]: R } = {};
  return (...args: A) => {
    const key = JSON.stringify(args);
    if (!cache.hasOwnProperty(key)) {
      const result = fn(...args);
      cache[key] = result;
    }
    return cache[key];
  };
}

export const getOpenState = memoize((hours: string, date: Date): {
  state: boolean;
  nextOpenOrClose: Date | undefined;
} => {
  const openingHours = new OpeningHours(hours, nominatimCologne);
  const state = openingHours.getState(date);
  let nextOpenOrClose;
  const iterator = openingHours.getIterator(date);
  const endDate = addHours(date, 24);
  while (iterator.getDate() < endDate) {
    const newState = iterator.getState();
    if (newState !== state) {
      nextOpenOrClose = iterator.getDate();
    }
    const hasAdvanced = iterator.advance();
    if (!hasAdvanced) {
      return {
        state,
        nextOpenOrClose,
      };
    }
  }
  return {
    state,
    nextOpenOrClose,
  };
});

export function getDayIntervals(hours: string, date: Date) {
  const start = startOfDay(date);
  const end = addHours(endOfDay(date), 6);
  const openingHours = new OpeningHours(hours, nominatimCologne);
  const intervals = openingHours.getOpenIntervals(start, end);
  return intervals;
}

export function relativeDistance(target: Date, now: Date): string {
  const distance = formatDistance(target, now, {
    locale: deLocale,
  });
  // workaround for German grammar, TODO: find general solution
  return `in ${distance.replace(/\beine Stunde\b/, "einer Stunde")}`;
}
