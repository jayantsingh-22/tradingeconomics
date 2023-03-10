import { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
// import { Tooltip } from "bootstrap";

import { graphText, handleTooltipTitle, xAxisLabelFormat, yAxisTickFormat } from "../../libs/helpers/graphFormatting";
import { noData } from "../../Constants/keywords";

const BarChart = (props) => {
  const { axisLabels, graphData, id, dimensions, indicatorInfo, orderData, indicatorUnit } = props;

  const { height, width } = dimensions;
  const { xAxisLabel, yValue } = axisLabels;

  const [graphRendered, setGraphRendered] = useState(false);

  const color = "#5902ab";

  const svgRef = useRef(null);

  // const renderTooltip = () => {
  //   return (
  //     <div style={{ position: "fixed" }} className="tooltip" id={`${id}-line-tooltip`} role="tooltip">
  //       <div className="tooltip-arrow" style={{ transform: "translate(0, 125%)" }} />
  //       <div className="tooltip-inner">Tooltip Here</div>
  //     </div>
  //   );
  // };

  const convertValues = (val) => {
    if (val < 0) {
      return val * -1;
    }
    return val;
  };

  const graphDataValues = graphData.filter((data) => typeof data.value === "number");
  const meanValue = d3.mean(graphDataValues, (d) => convertValues(d[yValue]));

  const renderGraph = useCallback(
    (svgEl) => {
      const svg = d3.select(svgEl);

      const margin = { top: 25, right: 10, bottom: 25, left: 43 };

      const x = d3
        .scaleBand()
        .domain(d3.range(graphData.length))
        .range([margin.left, width - margin.right])
        .padding(0.1);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(graphDataValues, (d) => convertValues(d[yValue]))])
        .nice()
        .range([height - margin.bottom, margin.top]);

      const barHeight = (d) => {
        const value = d[yValue];

        if (value === noData) {
          return y(0) - y(meanValue);
        }
        if (value < 0) {
          return y(0) - y(value * -1);
        }
        return y(0) - y(value);
      };

      const handleBarY = (d) => {
        const value = d[yValue];

        if (value === noData) {
          return y(meanValue);
        }
        if (value < 0) {
          return y(value * -1);
        }
        return y(value);
      };

      const handleBarColor = (d) => {
        if (d[yValue] !== noData && d[yValue] > 0) {
          return color;
        }
        if (d[yValue] < 0) {
          return "#821E1A";
        }
        return "#828282";
      };

      const xAxis = (g) => {
        return g.attr("transform", `translate(0,${height - margin.bottom})`).call(
          d3
            .axisBottom(x)
            .tickFormat((i) => xAxisLabelFormat(graphData, i, xAxisLabel))
            .tickSizeOuter(0)
        );
      };

      const yAxis = (g) => {
        return g
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y).ticks().tickFormat(yAxisTickFormat(indicatorInfo, indicatorUnit, graphData)))
          .call((graphic) => graphic.select(".domain").remove())
          .call((graphic) =>
            graphic
              .append("text")
              .attr("x", 3)
              .attr("y", 18)
              .attr("fill", "currentColor")
              .style("font-weight", "bolder")
              .attr("text-anchor", "start")
              .text(graphText(indicatorInfo, graphData))
          );
      };

      svg.selectAll("g").transition().duration(50).style("opacity", 0).remove();

      svg
        .append("g")
        .attr("class", `main-graph main-graph-${id}`)
        .selectAll("rect")
        .data(graphData)
        .join((enter) => enter.append("rect"))
        .attr("fill", (d) => handleBarColor(d))
        .attr("title", (d) => handleTooltipTitle(d, indicatorInfo, yValue, xAxisLabel))
        .attr("id", () => `graph-bar`)
        .attr("x", (d, i) => x(i))
        .attr("y", y(0))
        .transition()
        .duration(80)
        .ease(d3.easeLinear)
        .delay((d, i) => i * 70)
        .attr("y", (d) => handleBarY(d))
        .attr("height", (d) => barHeight(d))
        .attr("width", x.bandwidth());

      svg.append("g").call(xAxis);

      svg.append("g").call(yAxis);

      // const tooltip = d3.select(`[id="${id}-line-tooltip"]`);

      return setGraphRendered(true);
    },
    [yValue, xAxisLabel, indicatorInfo, graphData, height, width, graphDataValues, meanValue, id, indicatorUnit]
  );

  // Render Graph
  useEffect(() => {
    const svgNode = svgRef.current;
    setGraphRendered(false);
    return renderGraph(svgNode);
  }, [orderData, renderGraph]);

  // Bar Tooltips
  useEffect(() => {
    if (graphRendered) {
      // const bars = Array.from(document.querySelectorAll(`[id="graph-bar"]`));
      // bars.map((tooltip) => {
      //   return new Tooltip(tooltip, {
      //     trigger: "hover",
      //     animation: true,
      //     placement: "top",
      //     html: true,
      //     title: tooltip.getAttribute("title"),
      //   });
      // });
    }
  }, [graphRendered, id, graphData]);

  return (
    <>
      <svg ref={svgRef} x="0" y="0" style={{ width: "100%", height: "100%" }} />
      {/* {renderTooltip()} */}
    </>
  );
};

export default BarChart;
