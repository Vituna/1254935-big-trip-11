const BAR_HEIGHT = 55;
const MIN_CTX_HEIGHT = 130;

import AbstractComponent from "./abstract-component.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {TYPES_OF_TRANSFER} from "../const.js";
import moment from 'moment';
import 'moment-duration-format';

export default class Stats extends AbstractComponent {
  getTemplate() {
    return `<section class="statistics visually-hidden">
    <h2 class="visually-hidden">Trip statistics</h2>
    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>
    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>
    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>`;
  }

  hide() {
    this.getElement().classList.add(`visually-hidden`);
  }

  show() {
    this.getElement().classList.remove(`visually-hidden`);
  }

  update(eventsData) {
    this._moneyChart.destroy();
    this._transportChart.destroy();
    this._timeSpendChart.destroy();
    this.getStatistics(eventsData);
  }

  getStatistics(eventsData) {
    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const transportCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeCtx = this.getElement().querySelector(`.statistics__chart--time`);
    const types = Array.from(new Set(eventsData.map((it) => it.type.id.toUpperCase())));
    const money = eventsData.map((it) => it.price);

    moneyCtx.height = BAR_HEIGHT * types.length > MIN_CTX_HEIGHT ? BAR_HEIGHT * types.length : MIN_CTX_HEIGHT;
    Chart.defaults.global.defaultFontColor = `black`;
    Chart.defaults.global.defaultFontFamily = `"Montserrat", "Arial", sans-serif`;
    Chart.defaults.global.defaultFontSize = 14;

    this._moneyChart = new Chart(moneyCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: types,
        datasets: [{
          data: money,
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `€ ${val}`
          }
        },
        title: {
          display: true,
          text: `MONEY`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }

    });

    const transfers = TYPES_OF_TRANSFER.map((it) => it.id);
    const events = eventsData.filter((event) => transfers.find((it) => event.type.id === it));
    const transportCount = events.reduce((acc, event) => {
      const type = event.type.id.toUpperCase();
      if (acc[type]) {
        acc[type] += 1;
      } else {
        acc[type] = 1;
      }
      return acc;
    }, {});
    const transports = Object.keys(transportCount);
    const counts = Object.values(transportCount);

    transportCtx.height = BAR_HEIGHT * transports.length > MIN_CTX_HEIGHT ? BAR_HEIGHT * transports.length : MIN_CTX_HEIGHT;
    this._transportChart = new Chart(transportCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: transports,
        datasets: [{
          data: counts,
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val}x`
          }
        },
        title: {
          display: true,
          text: `TRANSPORT`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }

    });

    const timeinCities = events.reduce((acc, event) => {
      const city = event.destination.city.toUpperCase();
      const start = moment(event.start);
      const end = moment(event.end);
      const time = end.diff(start, `hours`);
      if (acc[city]) {
        acc[city].push(time);
      } else {
        acc[city] = [time];
      }
      return acc;
    }, {});
    const cities = Object.keys(timeinCities);
    const time = (Object.values(timeinCities).map((it) => it.reduce((a, b) => (a + b))));

    timeCtx.height = BAR_HEIGHT * cities.length > MIN_CTX_HEIGHT ? BAR_HEIGHT * cities.length : MIN_CTX_HEIGHT;
    this._timeSpendChart = new Chart(timeCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: cities,
        datasets: [{
          data: time,
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val} H`
          }
        },
        title: {
          display: true,
          text: `TIME SPEND`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });
  }
}
