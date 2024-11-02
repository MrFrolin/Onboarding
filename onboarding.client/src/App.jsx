/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useLocalStorage } from "@uidotdev/usehooks";
import "./App.css";
import Layout from "./components/Layout";
import googleAuth from "./hooks/googleAuth";
import Loading from "./utils/Loading";
import Hero from "./components/Hero";
import ItTasks from "./tasks/ItTasks";
import Intro from "./components/Intro";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { AnimatedBackground } from "animated-backgrounds";
import { Fade, Roll } from "react-awesome-reveal";

function App() {
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   setTimeout(() => setLoading(false), 18300);
  // }, []);
  // if (loading) {
  //   return (
  //     <>
  //       {" "}
  //       <AnimatedBackground animationName="floatingBubbles" />
  //       <Loading />
  //     </>
  //   );
  // }
  return (
    <>
      <Navigation />
      <Fade triggerOnce duration="1500">
        <Hero />
        <Intro />
        <ItTasks />
        <Footer />
      </Fade>
    </>
  );
}

export default App;
