import React from "react";
import Home from "./components/Home.js";
import { Route, Routes } from "react-router-dom";
import Flow from "./components/Flow.js";

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/playground" element={<Flow />} />
            </Routes>
        </>
    )
}

export default App