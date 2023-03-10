/* eslint-disable no-restricted-globals */
import { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";

import { graphText, handleTooltipTitle, xAxisLabelFormat, yAxisTickFormat } from "../../libs/helpers/graphFormatting";
import { noData } from "../../Constants/keywords";

const LineChart = (props) => {
  const { axisLabels, graphData, dimensions, id, orderData, indicatorInfo, indicatorUnit } = props;

  const { height, width } = dimensions;
  const { xAxisLabel, yValue } = axisLabels;
  // eslint-disable-next-line no-unused-vars
  const [graphRendered, setGraphRendered] = useState(false);

  const color = "#5902ab";

  const svgRef = useRef(null);

  const renderTooltip = () => {
    return (
      <div style={{ position: "fixed" }} className="tooltip" id={`${id}-line-tooltip`} role="tooltip">
        <div className="tooltip-arrow" style={{ transform: "translate(0, 125%)" }} />
        <div className="tooltip-inner">Tooltip Here</div>
      </div>
    );
  };

  const renderGraph = useCallback(
    (svgEl) => {
      const svg = d3
        .select(svgEl)
        .attr("fill", "none")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round");

      const margin = { top: 25, right: 30, bottom: 30, left: 45 };

      const graphDataValues = graphData.filter((data) => typeof data.value === "number");
      const minValue = d3.min(graphDataValues, (d) => d[yValue]);

      const meanValue = d3.mean(graphDataValues, (d) => d[yValue]);

      const handleCircleFill = (d) => {
        if (d[yValue] === noData) {
          return "#828282";
        }
        return d[yValue] < 0 ? "red" : "#00BF19";
      };

      const calcYStartPoint = () => {
        const hasNegativeValue = graphDataValues.find((record) => record.value < 0);
        if (hasNegativeValue) {
          return minValue;
        }
        return 0;
      };

      const bisectGraph = (mx, x) => {
        const bisect = d3.bisector((d) => d.date).left;

        const date = x.invert(mx);
        const index = bisect(graphData, date, 1);
        const a = graphData[index - 1];
        const b = graphData[index];
        return b && date - a.date > b.date - date ? b : a;
      };

      const callout = (g, bisectedObj, tooltip) => {
        if (!bisectedObj) return g.style("display", "none");

        g.style("display", null).style("opacity", 1).style("pointer-events", "none");

        return g.select(".tooltip-inner").html(tooltip);
      };

      const handleMouseOver = (event, x, tooltip) => {
        const bisectedObj = bisectGraph(d3.pointer(event, this)[0], x);
        const { date } = bisectedObj;

        const circleEl = d3.select(`[id="${id}-circle-${date}"]`);
        const tooltipData = circleEl.attr("title");
        const circleElDimensions = circleEl.node().getBoundingClientRect();

        tooltip
          .style("transform", "translate(3%, -40%)")
          .style("left", `${circleElDimensions.x}px`)
          .style("top", ` ${circleElDimensions.y}px`)
          .call(callout, bisectedObj, tooltipData);
      };

      const x = d3
        .scaleUtc()
        .domain(d3.extent(graphData, (d) => new Date(d[xAxisLabel]).getUTCFullYear()))
        .range([margin.left, width - margin.right]);

      const y = d3
        .scaleLinear()
        .domain([calcYStartPoint(), d3.max(graphDataValues, (d) => d[yValue])])
        .nice()
        .range([height - margin.bottom, margin.top]);

      const line = d3
        .line()
        .defined((d) => !isNaN(d[yValue]))
        .x((d) => x(new Date(d[xAxisLabel]).getUTCFullYear()))
        .y((d) => y(d[yValue]));

      const xAxis = (g) => {
        return g.attr("transform", `translate(0,${height - margin.bottom})`).call(
          d3
            .axisBottom(x)
            .ticks(graphData.length - 1)
            .tickFormat((d, i) => xAxisLabelFormat(graphData, i, xAxisLabel))
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
              .select(".tick:last-of-type text")
              .clone()
              .attr("x", 3)
              .attr("y", -10)
              .attr("text-anchor", "start")
              .attr("font-weight", "bold")
              .text(graphText(indicatorInfo, graphData))
          );
      };

      svg.selectAll("g").transition().duration(50).style("opacity", 0).remove();
      svg.selectAll("path").transition().duration(50).style("opacity", 0).remove();

      svg.append("g").call(xAxis);

      svg.append("g").call(yAxis);

      svg
        .append("g")
        .selectAll("circle")
        .data(graphData)
        .join("circle")
        .attr("id", (d) => `${id}-circle-${new Date(d[xAxisLabel]).getUTCFullYear()}`)
        .attr("fill", (d) => handleCircleFill(d))
        .attr("cx", (d) => x(new Date(d[xAxisLabel]).getUTCFullYear()))
        .attr("cy", (d) => (d[yValue] === noData ? y(meanValue) : y(d[yValue])))
        .attr("r", 3)
        .attr("title", (d) => handleTooltipTitle(d, indicatorInfo, yValue, xAxisLabel));

      svg
        .append("path")
        .datum(graphData.filter(line.defined()))
        .attr("stroke", "#ccc")
        .attr("stroke-width", 2)
        .attr("d", line);

      svg.append("path").datum(graphData).attr("stroke", color).attr("stroke-width", 2).attr("d", line);

      const tooltip = d3.select(`[id="${id}-line-tooltip"]`);

      svg.on("touchmove mousemove", (e) => handleMouseOver(e, x, tooltip));
      svg.on("touchend mouseleave", () => tooltip.call(callout, null));

      return setGraphRendered(true);
    },
    [yValue, graphData, height, width, xAxisLabel, indicatorInfo, indicatorUnit, id]
  );

  useEffect(() => {
    const svgNode = svgRef.current;
    return renderGraph(svgNode);
  }, [orderData, renderGraph]);

  return (
    <>
      <svg ref={svgRef} x="0" y="0" style={{ width: "100%", height: "100%" }} />
      {renderTooltip()}
    </>
  );
};

export default LineChart;
