import { useState } from "react";
import { Button, Carousel, Collapse } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import * as img from "../../assets";
import UpdateTrip from "../../components/modal/update-trip";
import { API } from "../../config/api";

export default function Trip() {
  document.title = "Trip Income";
  const [currentIndex, setCurrentIndex] = useState();
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const { data: trip, refetch } = useQuery("IncomeTripCache", async () => {
    const response = await API.get("/trips");
    return response.data.data;
  });

  console.log(trip);

  const Delete = useMutation(async (e) => {
    Swal.fire({
      title: "Do you sure want delete this trip?",
      showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `Don't Delete`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        try {
          const response = API.delete(`/delete-trip/${e}`);

          const Toast = Swal.mixin({
            toast: true,
            position: "top",
            iconColor: "white",
            customClass: {
              popup: "colored-toast",
            },
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });
          Toast.fire({
            icon: "success",
            title: "Success Update",
          });

          refetch();
          console.log("delete Success", response);
        } catch (error) {
          const Toast = Swal.mixin({
            toast: true,
            position: "top",
            iconColor: "white",
            customClass: {
              popup: "colored-toast",
            },
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });
          Toast.fire({
            icon: "error",
            title: "Error, Please Try Again",
          });
          console.log("delete failed", error);
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  });

  function handleCarousel(index) {
    setCurrentIndex(index);
  }

  function money(value) {
    return value?.toLocaleString(["ban", "id"]);
  }

  return (
    <>
      <div className="container-locate-admin">
        <div className="header-trip">
          <p className="text-avenir fw-800 fs-36 trip-p">Income Trip</p>
          <div
            className="d-flex justify-content-center px-3 py-3 rounded-circle bg-light"
            style={{
              alignItems: "center",
              cursor: "pointer",
              // padding: "inherit 10px",
              boxSizing: "border-box",
            }}
            onClick={() => setOpen(!open)}
            aria-controls="example-collapse-text"
            aria-expanded={open}
          >
            <img
              src={img.arrow}
              alt="..."
              onClick={() => setOpen(!open)}
              style={{
                width: "1.5rem",
                height: "1.5rem",
              }}
              loading="lazy"
              aria-controls="example-collapse-text"
              aria-expanded={open}
            />
          </div>
          <Link to="/add-trip">
            <button className="link-add-trip">Add Trip</button>
          </Link>
        </div>
        <div className="wrapper-locate-admin">
          <div className="locate locate-admin">
            {/* <PlaceTour /> */}
            {trip
              ?.map((locate) => {
                return (
                  <div className="card-locate position-relative">
                    <Carousel fade interval={10000} indicators={false} controls={false}>
                      <Carousel.Item slide="false">
                        <img
                          className="d-block w-100"
                          src={locate.image}
                          alt="First slide"
                          style={{
                            objectFit: "cover",
                          }}
                        />
                      </Carousel.Item>
                    </Carousel>
                    <Link
                      to={`/detail-place/${locate.id}`}
                      className="text-decoration-none text-dark"
                    >
                      <div className="carousel-container">
                        <div>
                          <p className="quota-tour">
                            {locate.current_quota} / {locate.quota}
                          </p>
                          <h2 className="locate-name text-decoration-none">
                            {locate.title.substr(0, 23)}...
                          </h2>
                          <div className="inform">
                            <p className="locate-price text-decoration-none">
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              }).format(
                                (locate.quota - locate.current_quota) *
                                  locate.price
                              )}
                            </p>
                            <p className="locate-country">
                              {locate.Country.name}
                            </p>
                          </div>
                          <div
                            style={{ margin: "-1rem 0 1rem" }}
                            className="d-flex"
                          ></div>
                        </div>
                      </div>
                    </Link>
                    <Collapse in={open}>
                      <div>
                        <div
                          className="d-flex mx-2"
                          style={{ margin: "0 0 1rem" }}
                        >
                          <Button
                            variant="warning"
                            className="w-50 text-light me-2"
                            style={{
                              marginLeft: "-.1rem",
                            }}
                            onClick={() => {
                              setIdx(locate.id);
                              setModalShow(true);
                            }}
                          >
                            UPDATE
                          </Button>
                          <Button
                            variant="outline-danger"
                            className="w-50"
                            data-swal-toast-template="#my-template"
                            onClick={() => Delete.mutate(locate.id)}
                          >
                            DELETE
                          </Button>
                        </div>
                      </div>
                    </Collapse>
                    {/* <Modal>

                    </Modal> */}
                    <UpdateTrip
                      show={modalShow}
                      onHide={() => setModalShow(false)}
                      idx={idx}
                      set={setModalShow}
                      refetch={refetch}
                    />
                  </div>
                );
              })
              .reverse()}
          </div>
        </div>
      </div>
    </>
  );
}
