import { useEffect, useState } from "react";
import { indicators } from "../../Constants/indicators";
import { Chart, Country, Indicator } from "../../Constants/keywords";
import { WBIndicatorById } from "../../WorldBank/worldBankAPIs";

import GraphCard from "./GraphCard";
import SelectorCard from "./SelectorCard";

const Slot = (props) => {
  const { emptySlot, selectorCard, id, graphObj, isDesktopOrLaptop } = props;
  const { graphList, handleAddGraph, setGraphList } = emptySlot;
  const { regionCountriesFetched, regionalCountries } = selectorCard;

  const [selectionProgress, setSelectionProgress] = useState({ step: 0 });
  const [graphData, setGraphData] = useState({});
  const [indicatorsFetched, setIndicatorsFetched] = useState({
    fetched: false,
    error: false,
  });
  const [fetchError, setFetchError] = useState({ fetchError: false });

  // Fetch Indicators
  useEffect(() => {
    if (selectionProgress.step === 2 && !indicatorsFetched.fetched) {
      Promise.all(
        indicators.map((indicator) =>
          fetch(WBIndicatorById(indicator.id))
            .then((response) => response.json())
            .then((data) => {
              return { ...data[1][0], unit: indicator.unit };
            })
            .catch((err) => err)
        )
      )
        .then((values) =>
          setIndicatorsFetched({
            ...indicatorsFetched,
            indicators: values,
            fetched: true,
          })
        )
        .catch((err) => setFetchError({ fetchError: true, errorMessage: err }));
    }
  }, [selectionProgress, indicatorsFetched, fetchError]);

  useEffect(() => {
    if (graphList.length === 1 && !graphObj.created) {
      setSelectionProgress({ step: 0 });
    }
  }, [graphList, graphObj]);

  const handleAddGraphHere = () => {
    const modifiedGraphList = graphList;
    const graphIndex = modifiedGraphList.findIndex((obj) => obj.id === graphObj.id);
    modifiedGraphList.splice(graphIndex, 1, { ...graphObj, created: true });

    setGraphList([...modifiedGraphList]);
    handleAddGraph();
    setSelectionProgress((prev) => ({ step: prev.step + 1 }));
  };

  const handleDeleteSlot = () => {
    const modifiedGraphList = graphList;
    const graphIndex = modifiedGraphList.findIndex((obj) => obj.id === graphObj.id);
    modifiedGraphList.splice(graphIndex, 1, { id: graphObj.id });

    if (
      !modifiedGraphList[modifiedGraphList.length - 1].created &&
      !modifiedGraphList[modifiedGraphList.length - 2].created
    ) {
      modifiedGraphList.pop();
    }

    setGraphList([...modifiedGraphList]);
    setSelectionProgress({ step: 0 });
  };

  const handleSelect = (values) => {
    const { selectedItem, type } = values;
    const { item, indicatorTitle, indicatorUnit } = selectedItem;

    if (type === Country) {
      setGraphData({
        ...graphData,
        countryCode: item,
        countryTitle: selectedItem.country,
      });
    } else if (type === Indicator) {
      setGraphData({
        ...graphData,
        indicator: item,
        indicatorTitle,
        indicatorUnit,
      });
    } else if (type === Chart) {
      setGraphData({
        ...graphData,
        chart: item,
      });
    }

    return setSelectionProgress((prev) => ({ step: prev.step + 1 }));
  };

  const handleGoBack = () => setSelectionProgress((prev) => ({ step: prev.step - 1 }));

  const renderError = () => {
    <div className="alert alert-danger" style={{ height: "100%" }} role="alert">
      {fetchError.errorMessage}
    </div>;
  };

  const renderEmptySlot = () => {
    return (
      <div
        id={`emptySlot-${id}`}
        className="col card graph-card graph-card--empty justify-content-center align-items-center card-blank"
      >
        <section>
          <p className="select-cntry">Select a country by clicking the button.</p>
        </section>
        <button
          type="button"
          className="btn btn-outline-dark graph-card--empty__add-graph-button"
          onClick={handleAddGraphHere}
        >
          <i className="bi-plus-lg" />
        </button>
      </div>
    );
  };

  if (!graphObj.created) {
    return renderEmptySlot();
  }

  if (fetchError.fetchError) {
    return renderError();
  }

  if (selectionProgress.step === 4) {
    return (
      <GraphCard
        graphCardId={id}
        deleteCard={handleDeleteSlot}
        isDesktopOrLaptop={isDesktopOrLaptop}
        data={graphData}
      />
    );
  }
  return (
    <SelectorCard
      handleSelect={handleSelect}
      handleGoBack={handleGoBack}
      regionFetched={regionCountriesFetched}
      indicatorsFetched={indicatorsFetched}
      region={regionalCountries}
      progress={selectionProgress.step}
    />
  );
};

export default Slot;
