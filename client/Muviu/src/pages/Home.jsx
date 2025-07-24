import { useEffect, useState } from "react";
import { serverApi } from "../api";
import MovieCard from "../components/MovieCard";
import { Link } from "react-router";

export default function Home() {
  return (
    <>
      <div
        className="container"
        style={{ background: "#fff", minHeight: "100vh", padding: "0" }}
      >
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col-md-2 mb-4">
              <div className="bg-light p-3 rounded">
                <h6 className="mb-3">Search</h6>
                <input
                  className="form-control mb-3"
                  placeholder="Search Movie"
                />
                <h6 className="mb-2">Filter by Genre</h6>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="animation"
                    disabled
                  />
                  <label className="form-check-label" htmlFor="animation">
                    1
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="fantasy"
                    disabled
                  />
                  <label className="form-check-label" htmlFor="fantasy">
                    2
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="scifi"
                    disabled
                  />
                  <label className="form-check-label" htmlFor="scifi">
                    3
                  </label>
                </div>
              </div>
            </div>

            <MovieCard />
          </div>
        </div>
      </div>
      <Link to="/ai">
        <div className="circle">
          <img className="muviu" src="/image/robot.avif" alt="Muviu-Image" />
        </div>
      </Link>
    </>
  );
}
