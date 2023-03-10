import { Offcanvas, Tab } from "bootstrap";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "./SideLayout.scss";

const SideLayout = (props) => {
  const { list, fetched, isTabletOrMobile } = props;
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (fetched) {
      const sideListItems = Array.from(document.querySelectorAll(".list-group-item"));
      return sideListItems.map((item) => new Tab(item));
    }
    return null;
  }, [fetched, isTabletOrMobile]);

  useEffect(() => {
    const path = location.pathname;

    if (fetched) {
      if (path !== "/") {
        const splitPath = path.split("");
        const code = splitPath.slice(1, splitPath.length).join("");
        return setTimeout(() => {
          const triggeredTab = Tab.getInstance(document.getElementById(`list-${code}`));
          return triggeredTab.show();
        }, 100);
      }
      return null;
    }
    return null;
  }, [history.location, fetched, isTabletOrMobile]);

  const handleSelectedItem = (e, route) => {
    e.preventDefault();

    if (isTabletOrMobile) {
      const offCanvas = Offcanvas.getInstance(document.querySelector(".offcanvas"));

      offCanvas.hide();
    }

    history.push(`/${route}`);
  };

  const renderSelectionList = () => {
    return (
      <div className="list-group list-group-flush">
        {list.map((listOption) => (
          <button
            key={`${listOption.name}-item`}
            type="button"
            id={`list-${listOption.id}`}
            onClick={(e) => handleSelectedItem(e, listOption.id)}
            className="list-group-item side-list-item list-group-item-action"
          >
            {listOption.name}
          </button>
        ))}
      </div>
    );
  };

  const renderLoading = () => {
    return (
      <div className="d-flex text-primary justify-content-center align-items-center" style={{ height: "100%" }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  };

  const renderDisplay = () => {
    if (fetched) {
      return renderSelectionList();
    }
    return renderLoading();
  };

  const renderSideLayout = () => {
    if (isTabletOrMobile) {
      return (
        <>
          <div className="row" style={{ padding: "10px 10px 0 10px" }}>
            <div className="col-2 sidelayout-burger-button d-flex align-items-center justify-content-center">
              <button
                className="btn btn-outline-primary"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#sideLayoutCanvas"
                aria-controls="offcanvasExample"
              >
                <i className="bi bi-list" />
              </button>
            </div>

            <div className="col-10 sidelayout-header d-flex align-items-center">
              <h1 className="display-3 text-primary">Statistica</h1>
            </div>
          </div>
          <div
            className="offcanvas offcanvas-start"
            tabIndex="-1"
            id="sideLayoutCanvas"
            aria-labelledby="offcanvasExampleLabel"
          >
            <div className="offcanvas-header">
              <p className="h5 card-region">Select Region</p>
              <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" />
            </div>
            <div className="offcanvas-body">
              <div className="col-12 sidelayout ">
                <div className="card sidelayout__card">
                  <div className="card-body sidelayout__card__body">{renderDisplay()}</div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
    return (
      <div className="col col-lg-2 col-md-2 col-sm-1 sidelayout ">
        <div className="card sidelayout__card" style={{ height: "100%" }}>
          <h5 className="text-center card-region">Select Region</h5>
          <div className="card-body sidelayout__card__body">{renderDisplay()}</div>
        </div>
      </div>
    );
  };

  return <>{renderSideLayout()}</>;
};

export default SideLayout;
