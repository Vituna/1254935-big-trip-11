import {getPointTemplate} from "./point.js";

export const getDayTemplate = (index, date, events) =>
  `<li class="trip-days__item  day day--${index + 1}">
<div class="day__info">
  <span class="day__counter">${index + 1}</span>
  <time class="day__date" datetime="${new Date(date).toString().slice(4, 11)}">${new Date(date).toString().slice(4, 11)}</time>
</div>

<ul class="trip-events__list">
${events.map((event) => {
    return getPointTemplate(event);
  }).join(`
`)}
</ul>
</li>`;
