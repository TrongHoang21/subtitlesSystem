import React from "react";
import Uploader from "../userComponents/components/Uploader/Uploader";
import {Routes,Route,BrowserRouter,} from "react-router-dom";
import App from "../App";
import EditPage from "../userComponents/components/EditPage/EditPage";
import ResultPage from "../userComponents/components/Exporter/ResultPage";
import WorkspacePage from "../userComponents/components/User/WorkspacePage";
import LoginPage from "../userComponents/components/Login/LoginPage";
import RegisterPage from "../userComponents/components/Login/RegisterPage";
import PricePlanPage from "../userComponents/components/User/PricePlanPage";


//ADMIN PAGE IMPORTS
import AdminMainPage from "../adminComponents/pages/dev_AdminMainPage/AdminMainPage";
import PurchaseResult from "../userComponents/components/User/PurchaseResult";

    // "start": "serve -s build", //use when deploy
function RouteConfig() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="Uploader" element={<Uploader />} />
        <Route exact path="EditPage" element={<EditPage />} />
        <Route exact path="ResultPage" element={<ResultPage />} />
        <Route exact path="/" element={<App />} />
        <Route exact path="/dev_WorkspacePage" element={<WorkspacePage />} />
        <Route exact path="dev_login" element={<LoginPage />} />
        <Route exact path="dev_register" element={<RegisterPage />} />
        <Route exact path="dev_pricing" element={<PricePlanPage />} />
        <Route exact path="dev_pricingResult" element={<PurchaseResult />} />
        
        {/* Admin area */}
        <Route exact path="/dev_AdminMainPage/*" element={<AdminMainPage />} />

      </Routes>


    </BrowserRouter>
  );
}

export default RouteConfig;
