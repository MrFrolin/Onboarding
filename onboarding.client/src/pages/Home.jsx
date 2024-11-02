import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
import ItTasks from "../tasks/ItTasks";
import Intro from "../components/Intro";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export default function Home() {
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
                    <Intro />
                    <ItTasks />
                    <Footer />
                </>
            )}
            ;
        </div>
    );
}
