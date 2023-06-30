import { useEffect, useState } from "react";
import CardPerformance from "./card";
import "./landing-page.css";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { API } from "../../config/api";
import { Button, Carousel, Container } from "react-bootstrap";
import * as IMG from "../../assets";
import { useDispatch, useSelector } from "react-redux";
import { getTrip } from "../../redux/actions/trip";
import * as COMP from "../../components";

export default function LandingPages() {
  document.title = "Home";
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const [search, setSearch] = useState("");
  const [tourList, setTourList] = useState();

  const { data } = useQuery("tripCache", async () => {
    const response = await API.get("/trips");
    setTourList(response.data.data);
  });

  const { getTripLoading, getTripResult, getTripError } = useSelector(
    (state) => state.trip
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTrip());
  }, [dispatch]);

  return (
    <div className="container-fluid" style={{ padding: "0" }}>
      <div className="hero">
        <div className="title">
          <p className="light">
            <span>Explore</span> your amazing city together
          </p>
        </div>
        <div className="bar-search">
          <label className="label-search" htmlFor="search">
            Find Great Places to Holiday
          </label>
          <div className="input-search">
            <input
              id="search"
              type="text"
              name="search"
              onChange={(e) => setSearch(e.target.value)}
            />{" "}
            <a href="#trip" className="h-100" style={{ marginLeft: "-1rem" }}>
              <Button variant="warning" className="text-light">
                Search
              </Button>
            </a>
          </div>
        </div>
      </div>
      <div className="body">
        <div className="perform">
          <CardPerformance />
        </div>

        <h2 className="name-group" id="trip">
          Group Tour
        </h2>
        <COMP.ListTour search={search} />
      </div>
    </div>
  );
}
