import { useEffect, useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import usePrevious from "../../libs/helpers/usePrevious";

import GraphViews from "../GraphViews";

import "./ContentLayout.scss";

const ContentLayout = (props) => {
  const { defaultId, isDesktopOrLaptop } = props;
  const [graphAdded, setGraphAdded] = useState(false);
  const history = useHistory();

  const prevDisplayState = usePrevious(isDesktopOrLaptop);

  useEffect(() => {
    setGraphAdded(true);
  }, [history.location]);

  useEffect(() => {
    if (isDesktopOrLaptop !== prevDisplayState && graphAdded) {
      return setGraphAdded(false);
    }

    if (graphAdded) {
      const contentLayoutEl = document.querySelector(".content-layout");
      const contentEl = document.querySelector(".content-layout__card");

      contentEl.classList.add("content-layout__card--graph-added");
      return contentLayoutEl.classList.remove("content-layout--no-graph");
    }
    return null;
  }, [graphAdded, isDesktopOrLaptop, prevDisplayState]);

  const handleAddGraph = () => {
    history.push(`/${defaultId}`);
  };

  const renderAddGraphButton = () => {
    return (
      <div className="parent">
        <figure
          className="figure d-flex flex-column float-start justify-content-between align-items-center"
          style={{ height: "55%" }}
        >
          {isDesktopOrLaptop ? <h1 className="display-3 heading">Statistica</h1> : null}
          <h2 className="tagline text-center">Stats and data on topics that matter.</h2>
          <p className="info-para text-center">
            Statistica is a web app service that provides figures, data and statistics on several economic indicators of
            different countries over a varied period of time. <br />
            It fetches latest information from the <a href="https://www.worldbank.org/en/home">World Bank</a> sources
            using the World Bank API.
          </p>
          <button type="button" className="btn btn-outline-dark add-graph-button" onClick={handleAddGraph}>
            <i className="bi-plus-lg" />
          </button>
        </figure>
        <p className="btn-text text-center">Select region on the left or click the button above to get started.</p>
        <div className="learn-more">
          <p className="topics">To learn more, visit :</p>
          <section className="topic-links">
            <ul className="topics-list">
              <li>
                <a href="https://data.worldbank.org/">World Bank</a>
              </li>
              <li>
                <a href="https://www.imf.org/en/Data">IMF</a>
              </li>
              <li>
                <a href="https://tradingeconomics.com/">Trading Economics</a>
              </li>
              <li>
                <a href="https://data.oecd.org/">OECD</a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <Switch>
        <Route exact path="/" render={() => renderAddGraphButton()} />
        <Route exact path="/:option">
          <GraphViews isDesktopOrLaptop={isDesktopOrLaptop} />
        </Route>
      </Switch>
    );
  };

  const renderContentLayout = () => {
    if (isDesktopOrLaptop) {
      return (
        <div className="col col-xl-10 col-lg-10 col-md-10 col-sm-12 content-layout content-layout--no-graph">
          <div className="container bg-transparent content-layout__card">{renderContent()}</div>
        </div>
      );
    }
    return (
      <div className="row content-layout content-layout--no-graph">
        <div className="container bg-transparent content-layout__card">{renderContent()}</div>
      </div>
    );
  };

  return <>{renderContentLayout()}</>;
};

export default ContentLayout;
