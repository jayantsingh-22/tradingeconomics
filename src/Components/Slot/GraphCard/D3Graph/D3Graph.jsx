import { useEffect, useState } from "react";

import usePrevious from "../../../../libs/helpers/usePrevious";
import sortData from "../../../../libs/helpers/dataManipulation";

import "./D3Graph.scss";
import BarChart from "../../../BarChart";
import Loader from "../../../Loader";
import LineChart from "../../../LineChart";
import { BarChartStr } from "../../../../Constants/keywords";

const D3Graph = (props) => {
  const {
    dataForD3,
    axisLabels,
    inModal,
    id,
    isDesktopOrLaptop,
    selectorData,
    fetchedObj,
    indicatorInfo,
    indicatorUnit,
    orderData,
    dimensions,
  } = props;

  const { fetched, setFetched } = fetchedObj;

  // const data = dataForD3.sort((a, b) => a.date - b.date);

  const [graphData, setGraphData] = useState(null);
  const [graphDataUpdating, setGraphDataUpdating] = useState(false);
  const [graphDimensions, setGraphDimensions] = useState({});

  const prevOrderData = usePrevious(orderData);

  // sortData func. args (data,setGraphData,orderData,inModal,indicatorInfo)

  useEffect(() => {
    setGraphDataUpdating(true);
    if (!inModal) {
      if (orderData.page !== prevOrderData?.page) {
        return sortData(
          dataForD3,
          setGraphData,
          orderData,
          inModal,
          indicatorInfo,
          isDesktopOrLaptop,
          setGraphDataUpdating
        );
      }
      if (orderData.page === 0) {
        return sortData(
          dataForD3,
          setGraphData,
          orderData,
          inModal,
          indicatorInfo,
          isDesktopOrLaptop,
          setGraphDataUpdating
        );
      }
    }
    return sortData(
      dataForD3,
      setGraphData,
      orderData,
      inModal,
      indicatorInfo,
      isDesktopOrLaptop,
      setGraphDataUpdating
    );
  }, [dataForD3, orderData, prevOrderData, indicatorInfo, inModal, isDesktopOrLaptop]);

  useEffect(() => {
    const cardHeader = document.getElementById(`cardHeader-${id}`);

    if (!fetched.cardHeaderDimensionsFetched) {
      setTimeout(() => {
        const { height } = cardHeader.getBoundingClientRect();

        setGraphDimensions({
          width: dimensions.width,
          height: dimensions.height - height,
        });

        return setFetched({ ...fetched, cardHeaderDimensionsFetched: true });
      }, 200);
    }
  }, [id, dimensions, fetched, setFetched]);

  const barGraph = () => {
    return (
      <BarChart
        axisLabels={axisLabels}
        dimensions={graphDimensions}
        indicatorUnit={indicatorUnit}
        id={id}
        indicatorInfo={indicatorInfo}
        orderData={orderData}
        graphData={graphData}
      />
    );
  };

  const lineGraph = () => {
    return (
      <LineChart
        axisLabels={axisLabels}
        indicatorInfo={indicatorInfo}
        indicatorUnit={indicatorUnit}
        id={id}
        graphData={graphData}
        dimensions={graphDimensions}
        orderData={orderData}
      />
    );
  };

  const renderGraph = () => {
    if (selectorData.chart === BarChartStr) {
      return barGraph();
    }
    return lineGraph();
  };

  return !graphDataUpdating && graphData && fetched.cardHeaderDimensionsFetched ? renderGraph() : <Loader />;
};

export default D3Graph;
