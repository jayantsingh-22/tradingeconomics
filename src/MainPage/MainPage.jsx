import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

import MainLayout from "../Components/MainLayout";
import ContentLayout from "../Components/ContentLayout";
import SideLayout from "../Components/SideLayout";

import { WBRegions } from "../WorldBank/worldBankAPIs";
import "./MainPage.scss";

const MainPage = () => {
  const [sideOptions, setSideOptions] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [fetchedErr, setFetchedErr] = useState({
    errorStatus: false,
    errMessage: "",
  });

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  useEffect(() => {
    setFetched(false);
    fetch(WBRegions)
      .then((response) => response.json())
      .then((data) => {
        setSideOptions(data[1]);
        return setFetched(true);
      })
      .catch((err) => setFetchedErr({ errorStatus: true, errMessage: err }));
  }, []);

  const sideOptionsList = sideOptions.map((option) => {
    return { name: option.name, id: option.code };
  });

  const renderSideLayout = () => {
    return <SideLayout isTabletOrMobile={isTabletOrMobile} fetched={fetched} list={sideOptionsList} />;
  };

  const renderContentLayout = () => {
    if (fetchedErr.errorStatus) {
      return (
        <div className="alert alert-danger" role="alert">
          {fetchedErr.errMessage}
        </div>
      );
    }
    return <ContentLayout isDesktopOrLaptop={isDesktopOrLaptop} defaultId={fetched && sideOptionsList[0].id} />;
  };

  const renderDesktopOrLaptopDisplay = () => {
    return (
      <div id="main-page-layout" className="row gx-3 main-page__container" style={{ height: "inherit" }}>
        {renderSideLayout()}
        {renderContentLayout()}
      </div>
    );
  };

  if (fetchedErr.errorStatus) {
    return renderContentLayout();
  }

  return (
    <MainLayout>
      {isDesktopOrLaptop ? (
        <>{renderDesktopOrLaptopDisplay()}</>
      ) : (
        <>
          {renderSideLayout()}
          {renderContentLayout()}
        </>
      )}
    </MainLayout>
  );
};

export default MainPage;
