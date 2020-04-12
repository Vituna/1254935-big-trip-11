import {getDayTemplate} from "./point_day.js";

export const getDaysListTemplate = (events, dates) => {
  return `<ul class="trip-days">
  ${Array.from(dates).map((date, index) => {
    const dayEvents = events.filter((event) => {
      const eventDate = `${new Date(event.start)}`.slice(4, 10);
      return eventDate === date;
    });
    return getDayTemplate(index, date, dayEvents);
  }).join(``)
}
</ul>`;
};
