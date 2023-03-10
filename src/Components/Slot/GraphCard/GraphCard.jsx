import { useEffect, useState } from "react";
import { Modal, Tooltip } from "bootstrap";

import {
  BarChartStr,
  dateAscendingOrder,
  // eslint-disable-next-line no-unused-vars
  dateDescendingOrder,
  // eslint-disable-next-line no-unused-vars
  valueAscendingOrder,
  // eslint-disable-next-line no-unused-vars
  valueDescendingOrder,
} from "../../../Constants/keywords";

import { WBIndicatorByCountry } from "../../../WorldBank/worldBankAPIs";
import D3Graph from "./D3Graph";
import Loader from "../../Loader";

const GraphCard = (props) => {
  const { deleteCard, data, graphCardId, isDesktopOrLaptop } = props;
  const [fetched, setFetched] = useState({
    dataFetched: false,
    graphCardDimensionsFetched: false,
    cardHeaderDimensionsFetched: false,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [graphCardDimensions, setGraphCardDimensions] = useState({
    height: 0,
    width: 0,
  });
  const [orderData, setOrderData] = useState({
    page: 0,
    order: dateAscendingOrder,
  });

  const { countryCode, indicator, countryTitle, indicatorTitle, indicatorUnit, chart } = data;

  // Fetch indicator data by country
  useEffect(() => {
    fetch(WBIndicatorByCountry(countryCode, indicator))
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData !== null) {
          setGraphData(
            responseData[1].map((item) => {
              return {
                date: item.date,
                value: item.value,
                indicator: item.indicator.value,
              };
            })
          );
          return setFetched({ dimensionsFetched: false, dataFetched: true });
        }
        return responseData;
      });
  }, [countryCode, indicator]);

  // Retrieve Graph card dimensions && set tooltips
  useEffect(() => {
    const graphCard = document.getElementById(graphCardId);

    const pageNo = () => {
      if (!isDesktopOrLaptop) {
        return 0;
      }
      if (modalOpen) {
        return null;
      }
      return 0;
    };

    setOrderData((prev) => {
      return { page: pageNo(), order: prev.order };
    });

    if (modalOpen) {
      if (!fetched.graphCardDimensionsFetched) {
        const modal = document.getElementById(`modal-${graphCardId}`).childNodes[0];

        return setTimeout(() => {
          const { width, height } = modal.getBoundingClientRect();

          setGraphCardDimensions({
            width,
            height,
          });
          return setFetched({ ...fetched, graphCardDimensionsFetched: true });
        }, 200);
      }
      return null;
    }

    if (!fetched.graphCardDimensionsFetched) {
      return setTimeout(() => {
        const { width, height } = graphCard.getBoundingClientRect();

        setGraphCardDimensions({
          width,
          height,
        });
        return setFetched({ ...fetched, graphCardDimensionsFetched: true });
      }, 200);
    }

    if (fetched.dataFetched && !modalOpen) {
      const prevButton = document.getElementById(`${graphCardId}-button-nav-prev`);
      const nextButton = document.getElementById(`${graphCardId}-button-nav-next`);

      const buttonTooltip = () => {
        // eslint-disable-next-line no-new
        new Tooltip(prevButton, {
          title: "Previous",
          animation: true,
          placement: "left",
          trigger: "hover focus",
        });

        return new Tooltip(nextButton, {
          title: "Next",
          animation: true,
          placement: "right",
          delay: { show: 50, hide: 100 },
          trigger: "hover focus",
        });
      };

      return buttonTooltip();
    }
    return null;
  }, [graphCardId, modalOpen, fetched]);

  const renderCardActions = () => {
    const handleToggleFullscreenOff = () => {
      setOrderData({ ...orderData, page: 0 });
      setFetched({
        ...fetched,
        graphCardDimensionsFetched: false,
        cardHeaderDimensionsFetched: false,
      });
      return setModalOpen(false);
    };

    const handleToggleFullscreenOn = () => {
      const graphModal = new Modal(document.getElementById(`modal-${graphCardId}`), {
        backdrop: "static",
      });

      setOrderData({ ...orderData, page: 3 });
      setFetched({
        ...fetched,
        graphCardDimensionsFetched: false,
        cardHeaderDimensionsFetched: false,
      });

      setModalOpen(true);

      return graphModal.show();
    };

    const handleGraphNavigation = (e) => {
      const navButtonClicked = e.currentTarget.id;
      const nextButton = `${graphCardId}-button-nav-next`;
      const prevButton = `${graphCardId}-button-nav-prev`;

      const nextLimit = isDesktopOrLaptop ? 2 : 4;

      if (navButtonClicked === nextButton) {
        if (orderData.page < nextLimit) {
          return setOrderData((prev) => ({
            ...orderData,
            page: prev.page + 1,
          }));
        }
      } else if (navButtonClicked === prevButton) {
        if (orderData.page > 0) {
          return setOrderData((prev) => ({
            ...orderData,
            page: prev.page - 1,
          }));
        }
      }
      return null;
    };

    const handleSetOrder = (e) => {
      const { value } = e.target.attributes.value;

      return setOrderData({ ...orderData, order: value });
    };

    const renderNavButtons = () => {
      if ((!modalOpen && isDesktopOrLaptop) || !isDesktopOrLaptop) {
        return (
          <>
            <button
              type="button"
              id={`${graphCardId}-button-nav-prev`}
              onClick={(e) => handleGraphNavigation(e)}
              className="btn graph-card__actions__button graph-card__actions__button--pageNav"
            >
              <i className="bi bi-arrow-left-square-fill" />
            </button>
            <button
              type="button"
              id={`${graphCardId}-button-nav-next`}
              onClick={(e) => handleGraphNavigation(e)}
              className="btn graph-card__actions__button graph-card__actions__button--pageNav"
            >
              <i className="bi bi-arrow-right-square-fill" />
            </button>
          </>
        );
      }

      return null;
    };

    const renderFullScreenButton = () => {
      if (!modalOpen) {
        return (
          <button
            type="button"
            onClick={handleToggleFullscreenOn}
            className="btn graph-card__actions__button graph-card__actions__button--fullscreen"
          >
            <i className="bi bi-fullscreen" />
          </button>
        );
      }
      return null;
    };

    const renderCancelButton = () => {
      if (!modalOpen) {
        return (
          <button
            type="button"
            className="btn graph-card__actions__button graph-card__actions__button--close"
            onClick={modalOpen ? handleToggleFullscreenOff : deleteCard}
          >
            <i className="bi bi-x-lg" />
          </button>
        );
      }
      return (
        <button
          type="button"
          className="btn-close"
          onClick={handleToggleFullscreenOff}
          data-bs-dismiss="modal"
          aria-label="Close"
        />
      );
    };

    const renderOrderButton = () => {
      const renderDisabled = () => {
        if (chart === BarChartStr) {
          return "";
        }
        return "disabled";
      };
      return (
        <div className="dropdown">
          <button
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            id={`${graphCardId}-button-order`}
            className={`btn ${renderDisabled()} btn-primary graph-card__actions__button  graph-card__actions__button--order`}
          >
            <i className="bi bi-bar-chart-fill" />
          </button>
          <ul
            className="dropdown-menu dropdown-menu-dark dropdown-menu-start"
            aria-labelledby={`${graphCardId}-button-order`}
          >
            <div
              role="button"
              className="dropdown-item"
              value={dateAscendingOrder}
              onClick={(e) => handleSetOrder(e)}
              onKeyUp={(e) => handleSetOrder(e)}
              tabIndex={0}
            >
              Ascending Order
            </div>
            <div
              role="button"
              className="dropdown-item"
              value={dateDescendingOrder}
              onClick={(e) => handleSetOrder(e)}
              onKeyUp={(e) => handleSetOrder(e)}
              tabIndex={0}
            >
              Descending Order
            </div>
          </ul>
        </div>
      );
    };

    return (
      <>
        {renderOrderButton()}
        {renderNavButtons()}
        {renderFullScreenButton()}
        {renderCancelButton()}
      </>
    );
  };

  const renderCardHeader = () => {
    return (
      <div id={`cardHeader-${graphCardId}`} className="card-header graph-card__header">
        <span className="badge graph-card__badge bg-primary ">{countryTitle}</span>
        <h6 className="graph-card__heading text-center ">{indicatorTitle}</h6>
        <div className="graph-card__actions">{renderCardActions()}</div>
      </div>
    );
  };

  const renderGraph = () => {
    return (
      <D3Graph
        dataForD3={graphData}
        selectorData={data}
        indicatorInfo={indicator}
        indicatorUnit={indicatorUnit}
        isDesktopOrLaptop={isDesktopOrLaptop}
        inModal={modalOpen}
        orderData={orderData}
        id={graphCardId}
        fetchedObj={{ fetched, setFetched }}
        dimensions={graphCardDimensions}
        axisLabels={{
          xAxisLabel: "date",
          yAxisLabel: "value",
          yValue: "value",
        }}
      />
    );
  };

  const renderCardContent = () => {
    return (
      <>
        {renderCardHeader()}
        {fetched.graphCardDimensionsFetched ? renderGraph() : <Loader />}
      </>
    );
  };

  const renderModal = () => {
    const modalSize = () => {
      if (isDesktopOrLaptop) {
        return "modal-xl";
      }
      return "modal-fullscreen";
    };

    return (
      <div className="modal fade " id={`modal-${graphCardId}`}>
        <div className={`modal-dialog ${modalSize()} graph-card__modal`}>
          <div className="modal-content bg-dark">
            {modalOpen && fetched.graphCardDimensionsFetched ? renderCardContent() : <Loader />}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (fetched.dataFetched) {
      return (
        <>
          {!modalOpen ? renderCardContent() : <Loader />}
          {renderModal()}
        </>
      );
    }
    return <Loader />;
  };

  return (
    <div id={graphCardId} className={`col card graph-card graph-card-${graphCardId}`}>
      {renderContent()}
    </div>
  );
};

export default GraphCard;
