import { useEffect, useState } from "react";
import { serverApi } from "../api";
import MovieCard from "../components/MovieCard";
import withReactContent from "sweetalert2-react-content";
import { Link } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import Swal from "sweetalert2";

export default function Home() {
  const [input, setInput] = useState("");

  const handleAi = async (e) => {
    e.preventDefault();
    try {
      const response = await serverApi.post(
        "/recommendations",
        {
          userResponse: input,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const movie1 = response.data[0];
      const movie2 = response.data[1];
      const movie3 = response.data[2];

      Swal.fire({
        title: "Top 3 Recommended Films",
        html: `
    <div style="
      display: flex;
      flex-wrap: nowrap;
      gap: 8px;
      overflow-x: auto;
      padding: 8px;
    ">
      <div style="flex: 0 0 150px;">
        <Link href="/detail/${movie1.id}" style="text-decoration: none; color: inherit;">
          <div style="border: none; border-radius: 4px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
            <img src="${movie1.poster_path}" alt="${movie1.title}" style="width: 100%; display: block;">
            <div style="padding: 4px; text-align: center; font-size: 0.9rem; min-height:4rem;">
              ${movie1.title}
            </div>
          </div>
        </Link>
      </div>
      <div style="flex: 0 0 150px;">
        <Link href="/detail/${movie2.id}" style="text-decoration: none; color: inherit;">
          <div style="border: none; border-radius: 4px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
            <img src="${movie2.poster_path}" alt="${movie2.title}" style="width: 100%; display: block;">
            <div style="padding: 4px; text-align: center; font-size: 0.9rem; min-height:4rem;">
              ${movie2.title}
            </div>
          </div>
        </Link>
      </div>
      <div style="flex: 0 0 150px;">
        <Link href="/detail/${movie3.id}" style="text-decoration: none; color: inherit;">
          <div style="border: none; border-radius: 4px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
            <img src="${movie3.poster_path}" alt="${movie3.title}" style="width: 100%; display: block;">
            <div style="padding: 4px; text-align: center; font-size: 0.9rem; min-height:4rem;">
              ${movie3.title}
            </div>
          </div>
        </Link>
      </div>
    </div>
  `,
        showCloseButton: true,
        showConfirmButton: false,
        width: 550,
      });

      console.log(response.data);
    } catch (error) {
      console.log("Error at AI Home", error);
    }
  };

  const popover = (
    <Popover id="popover-basic" className="popover">
      <Popover.Header as="h3">Describe the film you like.</Popover.Header>
      <Popover.Body>
        <form onSubmit={handleAi}>
          <textarea
            className="form-control"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="mt-2 w-100 border border-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-send"
            >
              <path d="M0 0h24v24H0z" stroke="none" />
              <path d="M10 14L21 3M21 3l-6.5 18a.55.55 0 01-1 0L10 14l-7-3.5a.55.55 0 010-1L21 3" />
            </svg>
          </button>
        </form>
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <div className="content-container">
        <div className="container-fluid py-4">
          <div className="row">
            <MovieCard />
          </div>
        </div>
      </div>
      <OverlayTrigger trigger="click" placement="left" overlay={popover}>
        <div className="circle">
          <img className="muviu" src="/image/robot.avif" alt="Muviu-Image" />
        </div>
      </OverlayTrigger>
    </>
  );
}
