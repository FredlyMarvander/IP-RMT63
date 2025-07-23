import { useEffect, useState } from "react";
import { serverApi } from "../api";

export default function Home() {
  return (
    <div
      className="container"
      style={{ background: "#fff", minHeight: "100vh", padding: "0" }}
    >
      <div className="container-fluid py-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-2 mb-4">
            <div className="bg-light p-3 rounded">
              <h6 className="mb-3">Search</h6>
              <input className="form-control mb-3" placeholder="Search Movie" />
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
          {/* Main Content */}
          <div className="col-md-10">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <select className="form-select w-auto">
                <option>Latest</option>
                <option>Oldest</option>
              </select>
              <div>
                <span>
                  {/* Showing {movies.length > 0 ? (page - 1) * 8 + 1 : 0} -{" "}
                  {Math.min(page * 8, total)} movie from total {total} */}
                </span>
              </div>
            </div>
            <div className="row g-4">
              <div className="col-md-3">
                <div
                  className="card h-100 shadow-sm border-0"
                  style={{
                    background: "#222",
                    color: "#fff",
                    borderRadius: "18px",
                  }}
                >
                  <img
                    src=""
                    alt=""
                    className="card-img-top"
                    style={{
                      height: "320px",
                      objectFit: "cover",
                      borderTopLeftRadius: "18px",
                      borderTopRightRadius: "18px",
                    }}
                  />
                  <div
                    className="card-body d-flex flex-column justify-content-end"
                    style={{ minHeight: "120px" }}
                  >
                    <h5 className="card-title mb-1" style={{ fontWeight: 600 }}>
                      Tes
                    </h5>
                    <div
                      className="card-text"
                      style={{ fontSize: "0.95rem", color: "#bbb" }}
                    >
                      tess
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
