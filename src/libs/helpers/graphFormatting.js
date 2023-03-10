import * as d3 from "d3";

import {
  annualConsumerPriceInflation,
  currentAccountBalance,
  gdpAnnualGrowth,
  gdpPerCapita,
  gdpTotalinUSD,
  netMigration,
  populationGrowth,
  residentPatentApplication,
  totalLabourForce,
  totalPopulation,
  totalUnemployment,
} from "../../Constants/indicators";
import { BillionStr, MillionStr, noData, oneHundredThousandStr, TrillionStr } from "../../Constants/keywords";

const xAxisLabelFormat = (data, index, axisLabel) => {
  const tickLabel = data[index][axisLabel];
  const parsedInt = parseInt(data[index][axisLabel], 10);

  if (index === 0) {
    return tickLabel;
  }
  if (parsedInt < 2000) {
    const tickStr = tickLabel.split("");
    tickStr.splice(0, 2, " '' ");

    return tickStr.join("");
  }
  if (parsedInt === 2000) {
    return tickLabel;
  }

  const tickStr = tickLabel.split("");
  tickStr.splice(0, 2, ' "" ');

  return tickStr.join("");
};

const handleTooltipTitle = (data, indicatorInfo, yValue, xAxisLabel) => {
  const suffix = () => {
    switch (indicatorInfo) {
      case gdpTotalinUSD:
      case currentAccountBalance:
        switch (data.maxValue) {
          case TrillionStr:
            return TrillionStr;
          case BillionStr:
            return BillionStr;
          case MillionStr:
            return MillionStr;
          default:
            return null;
        }
      case gdpPerCapita:
        return "Per Capita";
      case totalPopulation:
      case totalLabourForce:
      case netMigration:
        switch (data.maxValue) {
          case BillionStr:
            return BillionStr;
          case MillionStr:
            return MillionStr;
          case oneHundredThousandStr:
            return oneHundredThousandStr;
          default:
            return oneHundredThousandStr;
        }
      default:
        return null;
    }
  };

  const renderValue = () => {
    const renderCurrencyValues = () => {
      if (data[yValue] === noData) {
        return "No Data";
      }
      return `$${d3.format([".1f"])(data[yValue])} ${suffix()}`;
    };

    const renderPopulationValues = () => {
      if (data[yValue] === noData) {
        return "No Data";
      }
      if (data.maxValue === oneHundredThousandStr) {
        return `${d3.format([".1s"])(data[yValue])} ${suffix()}`;
      }
      return `${d3.format([".1f"])(data[yValue])} ${suffix()}`;
    };

    switch (indicatorInfo) {
      case gdpTotalinUSD:
      case gdpPerCapita:
      case currentAccountBalance:
        return renderCurrencyValues();
      case totalPopulation:
      case totalLabourForce:
      case netMigration:
        return renderPopulationValues();
      case residentPatentApplication:
        return `${data[yValue]}`;
      default:
        if (data[yValue] === noData) {
          return noData;
        }
        return `${d3.format([".1f"])(data[yValue])} %`;
    }
  };

  return `<h5>Year: ${data[xAxisLabel]}</h5>
              <p>Value: ${renderValue()}</p>`;
};

const yAxisTickFormat = (indicatorInfo, indicatorUnit, graphData) => {
  const largestFigure = graphData[0].maxValue;

  const convertValues = (val) => {
    if (val < 0) {
      return val * -1;
    }
    return val;
  };

  const renderSuffix = () => {
    switch (largestFigure) {
      case TrillionStr:
        return "T";
      case BillionStr:
        return "B";

      case MillionStr:
        return "M";

      default:
        return "";
    }
  };

  const renderFormatSpecifier = () => {
    const has3digits = graphData.find((record) => {
      const { value } = record;
      const finalValue = convertValues(value);

      return finalValue >= 95;
    });

    if (has3digits) {
      return "($.0f";
    }
    return "($.1f";
  };

  const convertDollarfigures = () => {
    let suffix;
    let formatSpecifier;

    if (indicatorInfo === gdpTotalinUSD) {
      formatSpecifier = renderFormatSpecifier();
      suffix = renderSuffix();
    } else if (indicatorInfo === gdpPerCapita) {
      formatSpecifier = "($.1s";
      suffix = " ";
    } else {
      suffix = renderSuffix();
      formatSpecifier = renderFormatSpecifier();
    }

    return d3.formatLocale({ currency: ["$", suffix] }).format([formatSpecifier]);
  };

  const convertPopulationFigures = () => {
    if (largestFigure === BillionStr) {
      return d3.formatLocale({ currency: ["", "B"] }).format(["($.1f"]);
    }
    if (largestFigure === MillionStr) {
      return d3.formatLocale({ currency: ["", "M"] }).format(["($.1f"]);
    }
    return d3.format(["(.1s"]);
  };

  switch (indicatorInfo) {
    case gdpTotalinUSD:
    case gdpPerCapita:
    case currentAccountBalance:
      return convertDollarfigures();
    case totalPopulation:
    case totalLabourForce:
    case netMigration:
      return convertPopulationFigures();
    default:
      return d3.formatLocale({ currency: ["", indicatorUnit] }).format(["($.0f"]);
  }
};

const graphText = (indicatorInfo, graphData) => {
  switch (indicatorInfo) {
    case gdpTotalinUSD:
    case currentAccountBalance:
    case totalPopulation:
    case totalLabourForce:
    case netMigration:
      return graphData[0].maxValue;
    case populationGrowth:
    case gdpAnnualGrowth:
    case annualConsumerPriceInflation:
      return "annual %";
    case residentPatentApplication:
      return "No. of Applicaions";
    case gdpPerCapita:
      return "current US$";
    case totalUnemployment:
      return "% of total labour force";
    default:
      return "% of GDP";
  }
};

export { xAxisLabelFormat, handleTooltipTitle, yAxisTickFormat, graphText };
