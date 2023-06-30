import { useEffect } from "react";
import { Carousel, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as IMG from "../../assets";
import { getTrip } from "../../redux/actions/trip";

function ListTour({ search }) {
  const { findTripLoading, findTripResult, findTripError } = useSelector(
    (state) => state.trip
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTrip());
  }, [dispatch]);

  return (
    <div className="locate">
      {findTripLoading ? (
        <p className="fs-3 fw-semibold">Loading . . .</p>
      ) : findTripResult ? (
        findTripResult?.length === 0 ? (
          <Container style={{ width: "40rem", marginLeft: "-9.5rem" }}>
            <img src={IMG.noTrip} alt="..." className="w-100 rounded" />
          </Container>
        ) : (
          findTripResult &&
          findTripResult
            ?.filter((locate) => {
              if (search === "") {
                return locate;
              } else if (
                locate.Country.name.toLowerCase().includes(search.toLowerCase())
              ) {
                return locate;
              } else if (
                locate.transportation
                  .toLowerCase()
                  .includes(search.toLowerCase())
              ) {
                return locate;
              } else if (
                locate.accomodation.toLowerCase().includes(search.toLowerCase())
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
                  <img src={IMG.noTrip} alt="..." className="w-100 rounded-5" />
                </Container>;
              }
            })
            .map((locate) => {
              if (locate.current_quota != 0) {
                return (
                  <Link
                    key={locate.id}
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
        )
      ) : findTripError ? (
        <p className="fs-3 fw-semibold">{findTripError}</p>
      ) : (
        <p className="fs-3 fw-semibold">Data tidak ada</p>
      )}
    </div>
  );
}

export default ListTour;
