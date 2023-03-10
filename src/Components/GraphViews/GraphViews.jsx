import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Tooltip } from "bootstrap";

import { WBCountriesByRegion } from "../../WorldBank/worldBankAPIs";
import usePrevious from "../../libs/helpers/usePrevious";
import Slot from "../Slot";

import "./GraphViews.scss";

const GraphViews = (props) => {
  const { isDesktopOrLaptop } = props;
  const [graphList, setGraphList] = useState([{ id: 1 }]);
  const [regionalCountries, setRegionalCountries] = useState([]);
  const [regionCountriesFetched, setRegionCountriesFetched] = useState(false);
  const history = useHistory();
  const { option } = useParams();

  const prevRegionSelected = usePrevious(option);

  useEffect(() => {
    setGraphList([{ id: 1 }]);

    if (option !== prevRegionSelected) {
      setRegionCountriesFetched(false);
      fetch(WBCountriesByRegion(option))
        .then((response) => response.json())
        .then((data) => {
          if (data !== null) {
            setRegionalCountries(data[1]);
            return setRegionCountriesFetched(true);
          }
          return data;
        });
    }
  }, [option, history.location, prevRegionSelected]);

  useEffect(() => {
    const bars = Array.from(document.querySelectorAll(`[id="graph-bar"]`));

    bars.map((tooltip) => {
      return new Tooltip(tooltip, {
        trigger: "hover",
        animation: true,
        placement: "top",
        html: true,
        title: tooltip.getAttribute("title"),
      });
    });
  }, [graphList, isDesktopOrLaptop]);

  const handleAddGraph = () => {
    if (graphList.length < 4) {
      return setGraphList([...graphList, { id: graphList.length + 1 }]);
    }
    return null;
  };

  const renderGraphs = () => {
    return graphList.map((graph) => (
      <Slot
        key={graph.id}
        id={graph.id}
        isDesktopOrLaptop={isDesktopOrLaptop}
        graphObj={graph}
        emptySlot={{ graphList, handleAddGraph, setGraphList }}
        selectorCard={{ regionCountriesFetched, regionalCountries }}
        graphCard={{ category: option }}
      />
    ));
  };

  return (
    <>
      <div className="row bg-transparent mt-2 ms-2 me-2" style={{ height: "100%", width: "100%" }}>
        {renderGraphs()}
      </div>
    </>
  );
};

export default GraphViews;
