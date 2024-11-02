import React, { useState, useEffect } from "react";
import ManagerHero from "../components/ManagerHero";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import ManageTasks from "../components/manager/ManageTasks";
import UploadDoc from "../components/manager/UploadDoc";
import { Fade } from "react-awesome-reveal";

export default function ManagerHub() {
  const userStateLocalStorage = localStorage.getItem("FirestoreUser");
  const firestoreUserObj = JSON.parse(userStateLocalStorage);

  return (
    <>
      <Navigation />
      <Fade triggerOnce duration="1000">
        <ManagerHero />
        <ManageTasks taskCategory="Team-Tasks" />
        <UploadDoc folder={firestoreUserObj.teamId} />
        <Footer />
      </Fade>
    </>
  );
}
