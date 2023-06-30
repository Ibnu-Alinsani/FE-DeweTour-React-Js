import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import hotel from "../../assets/hotel.svg";
import plane from "../../assets/plane.svg";
import meal from "../../assets/meal.svg";
import time from "../../assets/time.svg";
import calendar from "../../assets/calendar.svg";
import * as img from "../../assets";
import { useMutation, useQuery } from "react-query";
import { API } from "../../config/api";
import Swal from "sweetalert2";
import { UserContext } from "../../context";
import { BallTriangle } from "react-loader-spinner";

import ModalImage from "../../components/modal/image-car";
import { useDispatch, useSelector } from "react-redux";
import { getTripById } from "../../redux/actions/trip";

export default function Detail() {
  document.title = "Detail Trip";
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  const {
    getTripResult: tour,
    getTripLoading,
    getTripError,
  } = useSelector((state) => state.trip);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTripById(id));
  }, [dispatch]);

  const { id } = useParams();
  const [count, setCount] = useState(1);
  const [money, setMoney] = useState(0);
  const [state, _] = useContext(UserContext);
  const [modalShow, setModalShow] = useState(false);
  const [idx, setIdx] = useState();

  useEffect(() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";

    const myMidtransClientKey = process.env.REACT_APP_MIDTRANS_CLIENT_KEY;

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  const { data: detailTrip } = useQuery("detailCache", async () => {
    const response = await API.get(`/trip/${id}`);
    return response.data.data;
  });

  // Handle Quota
  if (count > tour?.current_quota) {
    Swal.fire({
      title: "Warning",
      text: `You Order More than Quota`,
      icon: "warning",
    });
    setCount(tour.current_quota);
  }

  if (count < 0) {
    setCount(0);
  }

  useEffect(() => {
    if (detailTrip) {
      setMoney(tour?.price * count);
    }
  }, [count, tour]);

  // end handle quota

  // handle for get Date
  // const getNameMonth = [
  //   "Januari",
  //   "Februari",
  //   "Maret",
  //   "April",
  //   "Mei",
  //   "Juni",
  //   "Juli",
  //   "Agustus",
  //   "September",
  //   "Oktober",
  //   "November",
  //   "Desember",
  // ];
  // const getNameDay = [
  //   "Minggu",
  //   "Senin",
  //   "Selasa",
  //   "Rabu",
  //   "Kamis",
  //   "Jum'at",
  //   "Sabtu",
  // ];

  // let dateNow = new Date();
  // let date = `${getNameDay[dateNow.getDay()]}, ${dateNow.getDate()} ${
  //   getNameMonth[dateNow.getMonth()]
  // } ${dateNow.getFullYear()}`;

  let data = {
    CounterQty: count,
    Status: "pending",
    Total: money,
    TripID: detailTrip?.id,
  };

  function handleSelect(i) {
    setIdx(i);
  }

  // handleBook
  const navigate = useNavigate();
  const handleBookNow = useMutation(async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const body = JSON.stringify(data);

      const response = await API.post("/add-transaction", body, config);
      console.log(response);
      console.log("Transaction Success", response.data.data);

      const token = response.data.data.token;
      window.snap.pay(token, {
        onSuccess: function (result) {
          console.log(result, "success");
          navigate("/profile");
        },
        onPending: function (result) {
          console.log(result, "pending");
          navigate("/profile");
        },
        onError: function (result) {
          console.log(result, "error");
          navigate("/profile");
        },
        onClose: function () {
          alert("you closed the popup without finishing the payment");
        },
      });
    } catch (error) {
      Swal.fire({
        title: "error",
        text: `Sorry, Your order has failed. We will fix for you `,
        icon: "error",
      });
      console.log("Transaction failed", error);
    }
  });

  return getTripLoading ? (
    <div className="position-absolute top-0 bottom-0 start-0 end-0 border border-dark d-flex justify-content-center align-items-center">
      <BallTriangle
        height={100}
        width={100}
        radius={5}
        color="#ffaf00"
        ariaLabel="ball-triangle-loading"
        wrapperClass={{}}
        wrapperStyle=""
        visible={true}
      />
    </div>
  ) : tour ? (
    tour && (
      <>
        <div className="container-detail">
          <div className="header-detail">
            <h1>{tour?.title}</h1>
            <p>{tour?.Country.name}</p>
          </div>

          <ModalImage
            show={modalShow}
            onHide={() => setModalShow(false)}
            handleSelect={handleSelect}
            idx={idx}
            id={id}
          />

          <div className="carousel-detail">
            <div className="w-100 img-detail">
              <img
                src={tour?.image}
                alt={tour?.image}
                className="w-75 h-75"
                style={{
                  objectFit: "cover",
                }}
                // onClick={() => setModalShow(true)}
              />
            </div>
          </div>
          <p className="slash-info text-avenir fw-900 fs-18">
            Information Trip
          </p>
          <p className="fw-semibold slot bg-warning d-inline px-4 py-1 rounded mb-4 ">
            Quota Available :{" "}
            <span className="text-light ms-2">{tour?.current_quota}</span>
          </p>
          <div className="container-detail-trip text-avenir mt-4">
            <div className="wrapper-detail-trip text-avenir">
              <p className="text-avenir fw-800 fs-13 text-grey ">
                Accomodation
              </p>
              <div className="wrapper-icon-trip">
                <img src={hotel} alt="" />
                <strong className="text-avenir fw-800 fs-18">
                  {tour?.accomodation}
                </strong>
              </div>
            </div>
            <div className="wrapper-detail-trip">
              <p className="text-avenir fw-800 fs-13 text-grey ">
                Transportation
              </p>
              <div className="wrapper-icon-trip">
                <img src={plane} alt="" />
                <strong className="text-avenir fw-800 fs-18">
                  {tour?.transportation}
                </strong>
              </div>
            </div>
            <div className="wrapper-detail-trip">
              <p className="text-avenir fw-800 fs-13 text-grey ">Eat</p>
              <div className="wrapper-icon-trip">
                <img src={meal} alt="" />
                <strong className="text-avenir fw-800 fs-18">
                  {tour?.eat}
                </strong>
              </div>
            </div>
            <div className="wrapper-detail-trip">
              <p className="text-avenir fw-800 fs-13 text-grey ">Duration</p>
              <div className="wrapper-icon-trip">
                <img src={time} alt="" />
                <strong className="text-avenir fw-800 fs-18">
                  {tour?.day} day - {tour?.night} night
                </strong>
              </div>
            </div>
            <div className="wrapper-detail-trip">
              <p className="text-avenir fw-800 fs-13 text-grey ">Date Trip</p>
              <div className="wrapper-icon-trip">
                <img src={calendar} alt="" />
                <strong className="text-avenir fw-800 fs-18">
                  {tour?.date_trip}
                </strong>
              </div>
            </div>
          </div>
          <div className="description">
            <p className="text-avenir fs-18 fw-800 mb">Description</p>
            <p className="text-avenir fw-900 fs-14 text-grey text-justify">
              {tour?.description}
            </p>
          </div>
          <div>
            <div className="info-price">
              <p className="text-avenir fs-24 fw-900">
                <span className="text-orange text-avenir">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(tour?.price)}
                </span>{" "}
                / Person
              </p>
              <div className="btn-count">
                {state.role == "user" ? (
                  <>
                    <button
                      onClick={() => setCount(count - 1)}
                      className="btn-count-add text-avenir bg-orange"
                    >
                      -
                    </button>
                    <p className="text-avenir fw-900 fs-18 mt-3">{count}</p>
                    <button
                      onClick={() => setCount(count + 1)}
                      className="btn-count-sub  text-avenir bg-orange"
                    >
                      +
                    </button>
                  </>
                ) : state.role == "admin" ? (
                  <>
                    <p className="text-avenir fw-900 fs-18 mt-3">
                      You Are Admin
                    </p>
                  </>
                ) : state.role == "" ? (
                  <>
                    <p className="text-avenir fw-900 fs-18 mt-3">
                      You must Be Login First
                    </p>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <hr
              style={{
                color: "transparent",
              }}
            />
            {state.role == "user" ? (
              <>
                <div className="total mt-4">
                  <p className="text-avenir fw-900 fs-24">Total : </p>
                  <p className="text-avenir text-orange fw-900 fs-24">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(parseInt(money))}
                  </p>
                </div>
                <hr
                  style={{
                    color: "transparent",
                  }}
                />
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="container-btn-book">
            {state.role == "user" ? (
              <button
                className="btn-book bg-orange fw-900 fs-18 text-avenir"
                onClick={(e) => handleBookNow.mutate(e)}
              >
                BOOK NOW
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      </>
    )
  ) : getTripError ? (
    <p className="fs-3 fw-semibold">{getTripError}</p>
  ) : (
    <p className="fs-3 fw-semibold">Data tidak ada</p>
  );
}
