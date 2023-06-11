import { useNavigate, useParams, Navigate } from "react-router-dom";
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

import ModalImage from "../../components/modal/image-car";

export default function Detail() {
  useEffect(() => {
    window.scroll(0, 0);
  }, []);

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
  console.log(detailTrip?.current_quota);

  if (count > detailTrip?.current_quota) {
    Swal.fire({
      title: "Warning",
      text: `You Order More than Quota`,
      icon: "warning",
    });
    setCount(detailTrip.current_quota);
  }

  const images = [img.negara1, img.negara2, img.negara3];

  if (count < 0) {
    setCount(0);
  }

  useEffect(() => {
    if (detailTrip) {
      setMoney(detailTrip?.price * count);
    }
  }, [count, detailTrip]);

  // increment
  function handleAdd() {
    setCount(count + 1);
  }

  // decrement
  function handleSub() {
    setCount(count - 1);
  }

  // handle for get Date
  const getNameMonth = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const getNameDay = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jum'at",
    "Sabtu",
  ];

  let dateNow = new Date();
  let date = `${getNameDay[dateNow.getDay()]}, ${dateNow.getDate()} ${
    getNameMonth[dateNow.getMonth()]
  } ${dateNow.getFullYear()}`;

  let data = {
    CounterQty: count,
    Status: "pending",
    Total: money,
    TripID: detailTrip?.id,
  };

  function handleSelect(i, e) {
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

  return (
    <>
      <div className="container-detail">
        <div className="header-detail">
          <h1>{detailTrip?.title}</h1>
          <p>{detailTrip?.Country.name}</p>
        </div>

        <ModalImage
          show={modalShow}
          onHide={() => setModalShow(false)}
          handleSelect={handleSelect}
          idx={idx}
          id={id}
        />

        <div className="carousel-detail">
          {/* Nuka carousel */}
          <div className="w-100 img-detail">
            <img
              src={detailTrip?.image}
              alt={detailTrip?.image}
              className="w-75 h-75"
              style={{
                objectFit: "cover",
              }}
            />
          </div>
          {/* <div className="w-100">
            <div className="d-flex container-img-group">
              {images.map((e, i) => {
                return (
                  <div>
                    <img
                      src={e}
                      alt={e}
                      className="img-group-detail"s
                      onClick={() => {
                        setModalShow(true);
                        setIdx(i);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div> */}
        </div>
        <p className="slash-info text-avenir fw-900 fs-18">Information Trip</p>
        <p className="fw-semibold slot bg-warning d-inline px-4 py-1 rounded mb-4 ">
          Quota Available :{" "}
          <span className="text-light ms-2">{detailTrip?.current_quota}</span>
        </p>
        <div className="container-detail-trip text-avenir mt-4">
          <div className="wrapper-detail-trip text-avenir">
            <p className="text-avenir fw-800 fs-13 text-grey ">Accomodation</p>
            <div className="wrapper-icon-trip">
              <img src={hotel} alt="" />
              <strong className="text-avenir fw-800 fs-18">
                {detailTrip?.accomodation}
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
                {detailTrip?.transportation}
              </strong>
            </div>
          </div>
          <div className="wrapper-detail-trip">
            <p className="text-avenir fw-800 fs-13 text-grey ">Eat</p>
            <div className="wrapper-icon-trip">
              <img src={meal} alt="" />
              <strong className="text-avenir fw-800 fs-18">
                {detailTrip?.eat}
              </strong>
            </div>
          </div>
          <div className="wrapper-detail-trip">
            <p className="text-avenir fw-800 fs-13 text-grey ">Duration</p>
            <div className="wrapper-icon-trip">
              <img src={time} alt="" />
              <strong className="text-avenir fw-800 fs-18">
                {detailTrip?.day} day - {detailTrip?.night} night
              </strong>
            </div>
          </div>
          <div className="wrapper-detail-trip">
            <p className="text-avenir fw-800 fs-13 text-grey ">Date Trip</p>
            <div className="wrapper-icon-trip">
              <img src={calendar} alt="" />
              <strong className="text-avenir fw-800 fs-18">
                {detailTrip?.date_trip}
              </strong>
            </div>
          </div>
        </div>
        <div className="description">
          <p className="text-avenir fs-18 fw-800 mb">Description</p>
          <p className="text-avenir fw-900 fs-14 text-grey text-justify">
            {detailTrip?.description}
          </p>
        </div>
        <div>
          <div className="info-price">
            <p className="text-avenir fs-24 fw-900">
              <span className="text-orange text-avenir">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(detailTrip?.price)}
              </span>{" "}
              / Person
            </p>
            <div className="btn-count">
              {state.role == "user" ? (
                <>
                  <button
                    onClick={handleSub}
                    className="btn-count-add text-avenir bg-orange"
                  >
                    -
                  </button>
                  <p className="text-avenir fw-900 fs-18 mt-3">{count}</p>
                  <button
                    onClick={handleAdd}
                    className="btn-count-sub  text-avenir bg-orange"
                  >
                    +
                  </button>
                </>
              ) : state.role == "admin" ? (
                <>
                  <p className="text-avenir fw-900 fs-18 mt-3">You Are Admin</p>
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
  );
}
