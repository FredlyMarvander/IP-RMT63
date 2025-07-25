import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import Login from "./pages/LoginPage";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AuntLayout from "./layouts/AuntLayout";
import { Provider } from "react-redux";
import { store } from "./store";
import Detail from "./pages/Detail";
import Update from "./pages/Update";
import Favorite from "./pages/Favorite";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<AuntLayout />}>
              <Route path="" element={<Home />} />
              <Route path="favorite" element={<Favorite />} />

              <Route path="update/:id" element={<Update />} />
              <Route path="detail/:id" element={<Detail />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
