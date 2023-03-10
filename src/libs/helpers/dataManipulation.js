import {
  BillionStr,
  dateAscendingOrder,
  dateDescendingOrder,
  MillionStr,
  noData,
  oneHundredThousandStr,
  TrillionStr,
  valueAscendingOrder,
  valueDescendingOrder,
} from "../../Constants/keywords";

import {
  currentAccountBalance,
  gdpTotalinUSD,
  netMigration,
  totalLabourForce,
  totalPopulation,
} from "../../Constants/indicators";
import { trillion, billion, million, oneHundredThousand } from "../../Constants/values";

const sortData = (data, setGraphData, orderData, inModal, indicatorInfo, isDesktopOrTablet, setGraphDataUpdating) => {
  const { order, page } = orderData;
  const indexes = isDesktopOrTablet ? { stop: 21, next: 20 } : { stop: 11, next: 10 };
  const pagination = { stop: indexes.stop, start: 0, next: indexes.next };
  let finalData;

  const handleValue = (value, divider) => {
    if (value === null) {
      return noData;
    }
    if (divider) {
      return value / divider;
    }
    return value;
  };

  const convertValues = (val) => {
    if (val < 0) {
      return val * -1;
    }
    return val;
  };

  const convertGDPfigures = (dataToConvert) => {
    const hasTrillion = dataToConvert.find((record) => convertValues(record.value) >= trillion);

    if (hasTrillion) {
      const hasBillionValue = dataToConvert.find((record) => {
        const { value } = record;
        const finalValue = convertValues(value);

        return finalValue < trillion && finalValue >= billion;
      });

      return dataToConvert.map((record) => {
        return {
          ...record,
          value: handleValue(record.value, trillion),
          maxValue: TrillionStr,
          hasBillionFigure: hasBillionValue,
        };
      });
    }

    const hasBillion = dataToConvert.find((record) => convertValues(record.value) >= billion);

    if (hasBillion) {
      const hasMillionValue = dataToConvert.find((record) => {
        const { value } = record;
        const finalValue = convertValues(value);

        return finalValue < billion && finalValue >= million;
      });

      return dataToConvert.map((record) => {
        return {
          ...record,
          value: handleValue(record.value, billion),
          maxValue: BillionStr,
          hasMillionFigure: hasMillionValue,
        };
      });
    }

    const hasMillion = dataToConvert.find((record) => {
      const { value } = record;
      const finalValue = convertValues(value);

      return finalValue >= million;
    });

    if (hasMillion) {
      const figureLessThanMillion = dataToConvert.find((record) => {
        const { value } = record;
        const finalValue = convertValues(value);

        return finalValue < million && finalValue !== 0;
      });

      return dataToConvert.map((record) => {
        return {
          ...record,
          value: handleValue(record.value, million),
          maxValue: MillionStr,
          hasFigureLessThanMillion: figureLessThanMillion,
        };
      });
    }

    return dataToConvert;
  };

  const convertPopulationFigures = (dataToConvert) => {
    const hasBillion = dataToConvert.find((record) => {
      const { value } = record;
      const finalValue = convertValues(value);

      return finalValue >= billion;
    });

    if (hasBillion) {
      const hasMillionValue = dataToConvert.find((record) => {
        const { value } = record;
        const finalValue = convertValues(value);

        return finalValue < billion && finalValue >= million;
      });

      return dataToConvert.map((record) => {
        return {
          ...record,
          value: handleValue(record.value, billion),
          maxValue: BillionStr,
          hasMillionFigure: hasMillionValue,
        };
      });
    }

    const hasMillion = dataToConvert.find((record) => {
      const { value } = record;
      const finalValue = convertValues(value);

      return finalValue >= million;
    });

    if (hasMillion) {
      const figureLessThanMillion = dataToConvert.find((record) => record.value < million && record.value > 0);

      return dataToConvert.map((record) => {
        return {
          ...record,
          value: handleValue(record.value, million),
          maxValue: MillionStr,
          hasFigureLessThanMillion: figureLessThanMillion,
        };
      });
    }

    const hasOneHundredThousand = dataToConvert.find((record) => {
      const { value } = record;
      const finalValue = convertValues(value);

      return finalValue >= oneHundredThousand;
    });

    if (hasOneHundredThousand) {
      const figureLessThanOneHundredThousand = dataToConvert.find((record) => {
        const { value } = record;
        const finalValue = convertValues(value);

        return finalValue < oneHundredThousand && finalValue > 0;
      });

      return dataToConvert.map((record) => {
        return {
          ...record,
          value: handleValue(record.value),
          maxValue: oneHundredThousandStr,
          hasFigureLessThanOneHundredThousand: figureLessThanOneHundredThousand,
        };
      });
    }

    return dataToConvert.map((record) => {
      return {
        ...record,
        value: handleValue(record.value),
        maxValue: oneHundredThousandStr,
        hasFigureLessThanOneHundredThousand: true,
      };
    });
  };

  const convertDefaultFigures = (dataToConvert) => {
    return dataToConvert.map((record) => {
      return {
        ...record,
        maxValue: oneHundredThousandStr,
        value: handleValue(record.value),
      };
    });
  };

  switch (order) {
    case dateAscendingOrder:
      finalData = data.sort((a, b) => a.date - b.date);
      break;
    case dateDescendingOrder:
      finalData = data.sort((a, b) => b.date - a.date);
      break;
    case valueAscendingOrder:
      finalData = data.sort((a, b) => a.value - b.value);
      break;
    case valueDescendingOrder:
      finalData = data.sort((a, b) => b.value - a.value);
      break;
    default:
      break;
  }

  switch (page) {
    case 0:
      finalData = finalData.slice(pagination.start, pagination.stop);
      break;
    case 1:
      finalData = finalData.slice(pagination.next, pagination.stop + pagination.next);
      break;
    case 2:
      finalData = finalData.slice(pagination.next * 2, pagination.stop + pagination.next * 2);
      break;
    case 3:
      finalData = finalData.slice(pagination.next * 3, pagination.stop + pagination.next * 3);
      break;
    case 4:
      finalData = finalData.slice(pagination.next * 4, pagination.stop + pagination.next * 4);
      break;
    default:
      break;
  }

  switch (indicatorInfo) {
    case currentAccountBalance:
    case gdpTotalinUSD:
      finalData = convertGDPfigures(finalData);
      break;
    case totalPopulation:
    case totalLabourForce:
    case netMigration:
      finalData = convertPopulationFigures(finalData);
      break;
    default:
      finalData = convertDefaultFigures(finalData);
      break;
  }

  setGraphData(finalData);
  return setGraphDataUpdating(false);
};

export default sortData;
