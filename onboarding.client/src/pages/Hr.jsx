import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
import HrTasks from "../tasks/HrTasks";
import Intro from "../components/Intro";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import HrIntro from "../components/HrIntro";

export default function Hr() {
  const [loading, setLoading] = useState(false);
  return (
    <div>
      {loading ? (
        <div className="flex m-12 justify-center items-center">
          <TailSpin color="blue" radius={"8px"} />
        </div>
      ) : (
        <>
          <Navigation />
          <Hero />
          <HrIntro />
          <HrTasks />
          <Footer />
        </>
      )}
      ;
    </div>
  );
}
