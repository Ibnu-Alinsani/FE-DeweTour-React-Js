import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useQuery } from "react-query";
import * as IMG from "../../assets";
import * as COMP from "../../components";
import { API } from "../../config/api";
import { UserContext } from "../../context";

export default function Profile(props) {
  document.title = "Profile";
  const [state, _] = useContext(UserContext);
  const [fill, setFilter] = useState("");
  // const [image, setImage] = useState({
  //   image: "",
  // });
  const [modalShow, setModalShow] = useState(false);

  // GET DATA FROM DATABASE
  const { data: user, refetch } = useQuery("userCache", async () => {
    const response = await API.get(`/user/${state.user.id}`);
    return response.data.data;
  });

  return (
    <>
      <div className="container-profil">
        <div className="wrapper-content-profil">
          <div className="wrapper-info-profil ">
            <div className="content-profil ">
              <p className="fw-900 text-avenir fs-36">Personal info</p>
              <div className="wrapper-info-section">
                <img src={IMG.name} alt="..." />
                <div>
                  <p className="text-avenir fw-900 fs-14">{user?.fullname}</p>
                  <p className="text-avenir fs-12">Fullname</p>
                </div>
              </div>
              <div className="wrapper-info-section">
                <img src={IMG.email} alt="..." />
                <div>
                  <p className="text-avenir fw-900 fs-14">{user?.email}</p>
                  <p className="text-avenir fs-12">Email</p>
                </div>
              </div>
              <div className="wrapper-info-section">
                <img src={IMG.phone} alt="..." />
                <div>
                  <p className="text-avenir fw-900 fs-14">{user?.phone}</p>
                  <p className="text-avenir fs-12">Mobile phone</p>
                </div>
              </div>
              <div className="wrapper-info-section">
                <img src={IMG.maps} alt="..." />
                <div>
                  <p className="text-avenir fw-900 fs-14">{user?.address}</p>
                  <p className="text-avenir" style={{ fontSize: "1rem" }}>
                    Address
                  </p>
                </div>
              </div>
              <button
                className="text-avenir fs-18 w-50 bg-warning rounded py-3 px-2 text-light"
                type="submit"
                style={{ cursor: "pointer" }}
                onClick={() => setModalShow(true)}
              >
                Edit Profile
              </button>
            </div>
            <div className="photo-user">
              <img
                src={user?.image != "" ? user?.image : IMG.profil}
                alt="..."
              />
            </div>
          </div>
        </div>
        {user?.transaction.length !== 0 ? (
          <>
            <div className="">
              <h2>Filter</h2>
              <Button
                variant="success"
                className="ms-0"
                onClick={() => setFilter("success")}
              >
                Success
              </Button>
              <Button
                variant="warning"
                className="text-light"
                onClick={() => setFilter("pending")}
              >
                Pending
              </Button>
              <Button variant="primary" onClick={() => setFilter("")}>
                All
              </Button>
              <Form.Control
                type="text"
                placeholder="Search Your Ticket"
                name="fill"
                className="mt-4"
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <p className="text-avenir fw-900 fs-36 title-history mt-4">
              History Trip
            </p>
            {user?.transaction
              ?.filter((e) => {
                if (fill === "") {
                  return e;
                } else if (
                  e.status.toLowerCase().includes(fill?.toLowerCase())
                ) {
                  return e;
                } else if (
                  e.trip.title.toLowerCase().includes(fill?.toLowerCase())
                ) {
                  return e;
                } else if (
                  e.trip.country.name
                    .toLowerCase()
                    .includes(fill?.toLowerCase())
                ) {
                  return e;
                } else if (
                  e.trip.accomodation
                    .toLowerCase()
                    .includes(fill?.toLowerCase())
                ) {
                  return e;
                } else if (
                  e.trip.transportation
                    .toLowerCase()
                    .includes(fill?.toLowerCase())
                ) {
                  return e;
                }
              })
              .map((e) => {
                if (e.trip.title != "") {
                  return (
                    <div className="history-trip">
                      <div className="wrapper-booking wrapper-booking-history">
                        <div className="header-booking">
                          <img src={IMG.logo} style={{ border: "none" }} />
                          <div className="wrapper-date-booking">
                            <p className="p-booking fw-800 text-avenir">
                              Booking
                            </p>
                            <p className="date-booking text-avenir text-grey"></p>
                          </div>
                        </div>
                        <div className="info-trip-booking">
                          <div className="title-and-status-trip w-100">
                            <div className="wrapper-title-trip mb-3">
                              <p className="fw-900 text-avenir fs-24 m-0">
                                {e.trip.title}
                              </p>
                              <p className="m-0 text-avenir fs-14 text-grey">
                                {e.trip.country.name}
                              </p>
                            </div>
                            {e.status == "success" ? (
                              <p
                                className="text-success d-inline px-2 py-2 rounded-2"
                                style={{ background: "lightgreen" }}
                              >
                                SUCCESS
                              </p>
                            ) : e.status == "failed" ? (
                              <p
                                className="text-danger d-inline px-2 py-2 rounded-2"
                                style={{ background: "pink" }}
                              >
                                FAILED
                              </p>
                            ) : (
                              <p
                                className="text-warning d-inline px-2 py-2 rounded-2"
                                style={{ background: "lightYellow" }}
                              >
                                PENDING
                              </p>
                            )}
                          </div>
                          <div className="wrapper-info-trip-booking w-100">
                            <div className="detail-info-trip-booking">
                              <p className="title-info-trip-booking fw-800 fs-18 text-avenir">
                                Date Trip
                              </p>
                              <p className="content-info-trip-booking fs-14 text-avenir text-grey">
                                {e.trip.date_trip}
                              </p>
                            </div>
                            <div className="detail-info-trip-booking">
                              <p className="title-info-trip-booking fw-800 fs-18 text-avenir">
                                Duration
                              </p>
                              <p className="content-info-trip-booking fs-14 text-avenir text-grey">
                                {e.trip.day} Day - {e.trip.night} Night
                              </p>
                            </div>
                            <div className="detail-info-trip-booking">
                              <p className="title-info-trip-booking fw-800 fs-18 text-avenir">
                                Accomodation
                              </p>
                              <p className="content-info-trip-booking fs-14 text-avenir text-grey">
                                {e.trip.accomodation}
                              </p>
                            </div>
                            <div className="detail-info-trip-booking">
                              <p className="title-info-trip-booking fw-800 fs-18 text-avenir">
                                Transportation
                              </p>
                              <p className="content-info-trip-booking fs-14 text-avenir text-grey">
                                {e.trip.transportation}
                              </p>
                            </div>
                          </div>
                          <div className="input-photo-booking">
                            <label className="custom-qr">
                              <img
                                src={IMG.qr}
                                alt=".."
                                className="qr-user w-100"
                              />
                            </label>
                            <p className="text-avenir fs-13 text-grey">
                              TCK0101
                            </p>
                          </div>
                        </div>
                        <div className="wrapper-table-info-user">
                          <table
                            className="table-info-user w-100"
                            cellSpacing={0}
                          >
                            <tr className="w-100 fluid">
                              <th className="" style={{ width: "3rem" }}>
                                No
                              </th>
                              <th
                                className="text-avenir fw-800 fs-18"
                                style={{ width: "23rem" }}
                              >
                                Full Name
                              </th>
                              <th className="text-avenir fw-800 fs-18">
                                Phone
                              </th>
                              <th></th>
                              <th></th>
                            </tr>
                            <tr
                              className="w-100"
                              style={{ borderBottom: "1px solid black" }}
                            >
                              <td className="fw-400 fs-18 text-grey">1</td>
                              <td className="fw-400 fs-18 text-grey">
                                {user?.fullname}
                              </td>
                              <td
                                className="fw-400 fs-18 text-grey"
                                style={{ width: "20rem" }}
                              >
                                {user?.phone}
                              </td>
                              <td className="text-avenir fs-18 fw-800">
                                Qty : {e.counterQty}
                              </td>
                            </tr>
                            {/* <tr>
                          <td>Total : 
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(e.total)}</td>
                        </tr> */}
                          </table>
                          <div className="w-100 d-flex fs-18 justify-content-end">
                            <div
                              className="d-flex align-items-center mt-3"
                              style={{ width: "29.7%" }}
                            >
                              <p className="fw-bold">
                                Total:{" "}
                                {new Intl.NumberFormat("id-ID", {
                                  style: "currency",
                                  currency: "IDR",
                                }).format(e.total)}
                              </p>
                            </div>
                          </div>
                          <div className="text-end total-booking">
                            <p className="text-avenir fs-18 fw-800"></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              })
              .reverse()}
          </>
        ) : (
          <>
            <p className="text-avenir fw-900 fs-36 title-history mt-5">
              History Trip
            </p>
            <div className="w-100 d-flex justify-content-center mt-5">
              <img
                src={IMG.noTrip}
                alt="..."
                className="w-50 m-auto border text-center rounded-5"
              />
            </div>
          </>
        )}
        {/* {dataMap} */}
      </div>
      <COMP.UpdateProfile
        show={modalShow}
        onHide={() => setModalShow(false)}
        setShow={setModalShow}
      />
    </>
  );
}
