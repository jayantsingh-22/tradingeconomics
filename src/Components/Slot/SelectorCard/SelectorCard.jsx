import { BarChartStr, Chart, Country, Indicator, LineChartStr } from "../../../Constants/keywords";
import Loader from "../../Loader";

const SelectorCard = (props) => {
  const { handleSelect, region, progress, regionFetched, indicatorsFetched, handleGoBack } = props;
  // const { gdpTotalinUSD, totalPopulation } = indicators;

  const progressStep = { 1: "25", 2: "50", 3: "75" };

  const countrySelector = () => {
    if (regionFetched) {
      return (
        <div className="list-group">
          {region.map((country) => (
            <button
              key={`${country.name}-item`}
              type="button"
              id={`list-${country.id}`}
              onClick={() =>
                handleSelect({
                  selectedItem: { item: country.id, country: country.name },
                  type: Country,
                })
              }
              className="list-group-item list-group-item-action"
            >
              {country.name}
            </button>
          ))}
        </div>
      );
    }
    return <Loader />;
  };

  const indicatorSelector = () => {
    if (indicatorsFetched.fetched) {
      const { indicators } = indicatorsFetched;
      return (
        <div className="list-group">
          {indicators.map((indicator) => (
            <button
              key={indicator.id}
              type="button"
              id={indicator.id}
              onClick={() =>
                handleSelect({
                  selectedItem: {
                    item: indicator.id,
                    indicatorTitle: indicator.name,
                    indicatorUnit: indicator.unit,
                  },
                  type: Indicator,
                })
              }
              className="list-group-item list-group-item-action"
            >
              {indicator.name}
            </button>
          ))}
        </div>
      );
    }

    return <Loader />;
  };

  const graphSelector = () => {
    return (
      <div className="list-group">
        <button
          id="graph-selector-BarChart"
          type="button"
          onClick={() =>
            handleSelect({
              selectedItem: { item: BarChartStr },
              type: Chart,
            })
          }
          className="list-group-item list-group-item-action"
        >
          Bar Chart
        </button>
        <button
          id="graph-selector-LineChart"
          type="button"
          onClick={() =>
            handleSelect({
              selectedItem: { item: LineChartStr },
              type: Chart,
            })
          }
          className="list-group-item list-group-item-action"
        >
          Line Chart
        </button>
      </div>
    );
  };

  const renderSelector = () => {
    if (progress === 1) {
      return countrySelector();
    }
    if (progress === 2) {
      return indicatorSelector();
    }
    if (progress === 3) {
      return graphSelector();
    }
    return null;
  };

  const renderProgressBar = () => {
    const renderProgressTitle = () => {
      if (progress === 1) {
        return "Select Country";
      }
      if (progress === 2) {
        return "Select Indicator";
      }
      return "Select Chart";
    };
    return (
      <div className="progress">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${progressStep[progress]}%` }}
          // eslint-disable-next-line jsx-a11y/aria-proptypes
          aria-valuenow={`${progressStep[progress]}`}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {renderProgressTitle()}
        </div>
      </div>
    );
  };

  const renderButtonBack = () => {
    if (progress > 1) {
      return (
        <div className="button-back col-2 justify-content-lg-start">
          <button type="button" onClick={handleGoBack} className="btn btn-md btn-outline-primary">
            Back
          </button>
        </div>
      );
    }
    return null;
  };

  const renderClassName = () => {
    if (progress === 1) {
      return "card-body";
    }
    return "card-body card-body--with-button";
  };

  return (
    <div className="col card card-select-country">
      {renderProgressBar()}
      <div className={renderClassName()}>{renderSelector()}</div>
      {renderButtonBack()}
    </div>
  );
};

export default SelectorCard;
