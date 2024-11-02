import React, { useState, useEffect } from "react";
import ManagerHero from "../components/ManagerHero";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import ManageTasks from "../components/manager/ManageTasks";
import UploadDoc from "../components/manager/UploadDoc";
import { Fade } from "react-awesome-reveal";
import HrHero from "../components/HrHero";
import ManageHRTasks from "../components/HR/ManageHRTasks";

export default function HrHub() {
  return (
    <>
      <Navigation />
      <Fade triggerOnce duration="1000">
        <HrHero />
        <ManageHRTasks taskCategory="HR-Tasks" />
        <UploadDoc folder="HR-Documents" />
        <Footer />
      </Fade>
    </>
  );
}
