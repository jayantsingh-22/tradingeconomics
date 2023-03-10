import { BrowserRouter as Router } from "react-router-dom";
import MainPage from "../MainPage";
import Footer from "../Components/Footer/footer";

import "./App.scss";

const App = () => {
  return (
    <Router>
      <MainPage />
      <Footer />
    </Router>
  );
};

export default App;
