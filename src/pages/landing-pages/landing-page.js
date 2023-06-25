import { useEffect, useState } from "react";
import CardPerformance from "./card";
import "./landing-page.css";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { API } from "../../config/api";
import { Button, Carousel, Container } from "react-bootstrap";
import * as IMG from "../../assets";

export default function LandingPages() {
  document.title = "Home";
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const [search, setSearch] = useState("");
  const [tourList, setTourList] = useState();

  const { data: trip, refetch } = useQuery("tripCache", async () => {
    const response = await API.get("/trips");
    setTourList(response.data.data);
    console.log(response);
  });

  return (
    <div className="container-fluid" style={{ padding: "0" }}>
      <div className="hero">
        <div className="title">
          <p className="light">
            <span>Explore</span> your amazing city together
          </p>
        </div>
        <div className="bar-search">
          <label className="label-search" htmlFor="searc">
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

        <h2 className="name-group" id="trip">Group Tour</h2>

        <div className="locate">
          {tourList?.length === 0 ? (
            <Container style={{ width: "40rem", marginLeft:"-9.5rem" }}>
              <img src={IMG.noTrip} alt="..." className="w-100 rounded" />
            </Container>
          ) : (
            tourList
              ?.filter((locate) => {
                if (search === "") {
                  return locate;
                } else if (
                  locate.Country.name
                    .toLowerCase()
                    .includes(search.toLowerCase())
                ) {
                  return locate;
                } else if (
                  locate.transportation
                    .toLowerCase()
                    .includes(search.toLowerCase())
                ) {
                  return locate;
                } else if (
                  locate.accomodation
                    .toLowerCase()
                    .includes(search.toLowerCase())
                ) {
                  return locate;
                } else if (
                  locate.date_trip.toLowerCase().includes(search.toLowerCase())
                ) {
                  return locate;
                } else if (
                  locate.title.toLowerCase().includes(search.toLowerCase())
                ) {
                  return locate;
                } else {
                  <Container className="w-100">
                    <img
                      src={IMG.noTrip}
                      alt="..."
                      className="w-100 rounded-5"
                    />
                  </Container>;
                }
              })
              .map((locate) => {
                if (locate.current_quota != 0) {
                  return (
                    <Link
                      to={`/detail-place/${locate.id}`}
                      className="text-decoration-none"
                    >
                      <div className="card-locate">
                        <Carousel fade indicators={false} controls={false}>
                          <Carousel.Item>
                            <img
                              className="d-block w-100"
                              src={locate.image}
                              alt="First slide"
                              loading="lazy"
                            />
                          </Carousel.Item>
                        </Carousel>
                        <div className="carousel-container">
                          <div>
                            <p className="quota-tour">{locate.current_quota}</p>
                            <h2 className="locate-name text-decoration-none">
                              {locate.title.substr(0, 23)}...
                            </h2>
                            <div className="inform">
                              <p className="locate-price text-decoration-none">
                                {new Intl.NumberFormat("id-ID", {
                                  style: "currency",
                                  currency: "IDR",
                                }).format(locate.price)}
                              </p>
                              <p className="locate-country">
                                {locate.Country.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                }
              })
              .reverse()
          )}
        </div>
      </div>
    </div>
  );
}
