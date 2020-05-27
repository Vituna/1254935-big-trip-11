import AbstractSmartComponent from "./abstract-smart-component";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {BAR_HEIGHT, TypeChart, typeIcon} from "./consts";
import {getUniqItems} from "../utils/common";
import {formatedDuration, getCountByTypes, getDurationByTypes, getMoneyByTypes} from "../utils/statistics";

const ChartParameter = {
  TYPE: `horizontalBar`,
  BACKGROUND_COLOR: `#ffffff`,
  MIN_BAR_LENGTH: 50,
  BAR_THICKNESS: 44,
  ANCHOR: `start`,
  OPTION_ANCHOR: `end`,
  ALIGN: `start`,
  FONT_COLOR: `#000000`,
  FONT_SIZE: 13,
  PADDING: 5,
  TITLE_SIZE: 23,
  TITLE_POSITION: `left`,
};

const GetFormat = {
  "MONEY": (val) => `€ ${val}`,
  "TRANSPORT": (val) => `${val}x`,
  "TIME SPENT": (val) => `${formatedDuration(val)}`
};

const configChart = (types, data, typeChart) => {
  return {
    plugins: [ChartDataLabels],
    type: ChartParameter.TYPE,
    data: {
      labels: types,
      datasets: [{
        data,
        backgroundColor: ChartParameter.BACKGROUND_COLOR,
        hoverBackgroundColor: ChartParameter.BACKGROUND_COLOR,
        anchor: ChartParameter.ANCHOR,
        minBarLength: ChartParameter.MIN_BAR_LENGTH,
        barThickness: ChartParameter.BAR_THICKNESS,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: ChartParameter.FONT_SIZE
          },
          color: ChartParameter.FONT_COLOR,
          anchor: ChartParameter.OPTION_ANCHOR,
          align: ChartParameter.ALIGN,
          formatter: GetFormat[typeChart]
        }
      },
      title: {
        display: true,
        text: typeChart,
        fontColor: ChartParameter.FONT_COLOR,
        fontSize: ChartParameter.TITLE_SIZE,
        position: ChartParameter.TITLE_POSITION
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: ChartParameter.FONT_COLOR,
            padding: ChartParameter.PADDING,
            fontSize: ChartParameter.FONT_SIZE,
            callback: (type) => {
              return `${typeIcon[type.toLowerCase()]} ${type}`;
            }
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
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
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  };
};

const renderMoneyChart = (moneyCtx, events, types) => {
  const moneyByTypes = getMoneyByTypes(types, events);

  moneyCtx.height = BAR_HEIGHT * types.length;

  return new Chart(moneyCtx, configChart(types, moneyByTypes, TypeChart.MONEY));
};

const renderTransportChart = (transportCtx, events, types) => {
  transportCtx.height = BAR_HEIGHT * types.length;

  const countByTypes = getCountByTypes(types, events);

  return new Chart(transportCtx, configChart(types, countByTypes, TypeChart.TRANSPORT));
};

const timeSpentChart = (timeSpentCtx, events, types) => {
  timeSpentCtx.height = BAR_HEIGHT * types.length;

  const durationByTypes = getDurationByTypes(types, events);

  return new Chart(timeSpentCtx, configChart(types, durationByTypes, TypeChart.TIME_SPENT));
};

const createStatistics = () => {

  return (
    `<section class="statistics">
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
    </section>`
  );
};

class Stats extends AbstractSmartComponent {
  constructor(pointModel) {
    super();

    this._events = pointModel;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatistics();
  }

  show() {
    super.show();

    this.rerender(this._events);
  }

  recoveryListeners() {}

  rerender(events) {
    this._events = events;

    super.rerender();

    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();
    const events = this._events.getPoints();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = element.querySelector(`.statistics__chart--time`);

    const types = events
      .map((event) => event.type)
      .filter(getUniqItems);

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, events, types);
    this._transportChart = renderTransportChart(transportCtx, events, types);
    this._timeSpendChart = timeSpentChart(timeSpendCtx, events, types);
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeSpendChart) {
      this._timeSpendChart.destroy();
      this._timeSpendChart = null;
    }
  }
}

export default Stats;
