import { useQuery, useMutation } from "react-query";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";

import * as MODAL from "../../components/modal";
import { API } from "../../config/api";
import Swal from "sweetalert2";

export default function AddTrip() {
  const Navigate = useNavigate();

  const [modalShow, setModalShow] = useState(false);
  const [preview, setPreview] = useState();
  const [form, setForm] = useState({
    title: "",
    country_id: "",
    accomodation: "",
    transportation: "",
    eat: "",
    day: "",
    night: "",
    dateTrip: "",
    price: "",
    quota: "",
    description: "",
    image: "",
  });

  let month = [
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

  let myDate = new Date(form.dateTrip);
  let date = `${myDate.getDate()} ${
    month[myDate.getMonth()]
  } ${myDate.getFullYear()}`;

  const { data: country } = useQuery("countryCache", async () => {
    const response = await API.get("/country");
    return response.data.data;
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
      console.log(url);
    }
  }

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.set("title", form.title);
      formData.set("country_id", form.country_id);
      formData.set("accomodation", form.accomodation);
      formData.set("transportation", form.transportation);
      formData.set("eat", form.eat);
      formData.set("day", form.day);
      formData.set("night", form.night);
      formData.set("dateTrip", date);
      formData.set("price", form.price);
      formData.set("quota", form.quota);
      formData.set("description", form.description);
      formData.set("image", form.image[0], form.image[0]?.name);

      const response = await API.post("/add-trip", formData, config);
      console.log("add product success : ", response);
      Swal.fire({
        title: "SUCCESS",
        text: `Add Trip Success, Waiting Your Income. 
        2000 buat admin`,
        icon: "success",
      });
      Navigate("/trip-income");
    } catch (error) {
      console.log("add product failed " + error);
    }
  });

  return (
    <>
      <MODAL.country show={modalShow} onHide={() => setModalShow(false)} modal={setModalShow}/>

      <div className="container-add-trip">
        <h1 className="title-add-trip text-avenir fw-800 fs-36 text-black">
          Add Trip
        </h1>
        <div className="wrapper-add-trip">
          <form onSubmit={(e) => handleSubmit.mutate(e)}>
            {/* title */}
            <label htmlFor="title">Title-trip</label>
            <div className="input-box">
              <input
                type="text"
                id="title"
                name="title"
                onChange={handleChange}
              />
            </div>
            {/* country */}
            <label htmlFor="country">Country</label>
            <div className="input-box d-flex" style={{ gap: "1rem" }}>
              <select
                className="input-country-select"
                name="country_id"
                onChange={handleChange}
              >
                <option>Select Your Country</option>
                {country?.map((e) => {
                  return <option value={e.id}>{e.name}</option>;
                })}
              </select>
              <div
                className="rounded bg-white"
                style={{
                  width: "3.2rem",
                  height: "3rem",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => setModalShow(true)}
              >
                <p className="fs-1 h-100 mt-1">+</p>
              </div>
            </div>
            {/* accomodation */}
            <label htmlFor="accomodation">Accomodation</label>
            <div className="input-box">
              <input
                type="text"
                id="accomodation"
                name="accomodation"
                onChange={handleChange}
              />
            </div>
            {/* transportation */}
            <label htmlFor="transportation">Transportation</label>
            <div className="input-box">
              <input
                type="text"
                id="transportation"
                name="transportation"
                onChange={handleChange}
              />
            </div>
            {/* eat */}
            <label htmlFor="eat">Eat</label>
            <div className="input-box">
              <input type="text" id="eat" name="eat" onChange={handleChange} />
            </div>
            {/* duration */}
            <label htmlFor="duration">Duration</label>
            <div className="input-box input-duration">
              <div className="input-box-duration-day">
                <input
                  type="number"
                  id="day"
                  name="day"
                  onChange={handleChange}
                />
                <p className="text-avenir fw-900 fs-24 text-black">Day</p>
              </div>
              <div className="input-box-duration-night">
                <input
                  type="number"
                  id="night"
                  name="night"
                  onChange={handleChange}
                />
                <p className="text-avenir fw-900 fs-24 text-black">Night</p>
              </div>
            </div>
            {/* datetrip */}
            <label htmlFor="date-trip">Date Trip</label>
            <div className="input-box">
              <input
                type="date"
                id="date-trip"
                name="dateTrip"
                onChange={handleChange}
              />
            </div>
            {/* price */}
            <label htmlFor="price">Price</label>
            <div className="input-box">
              <input
                type="number"
                id="price"
                name="price"
                onChange={handleChange}
              />
            </div>
            {/* quota */}
            <label htmlFor="quota">Quota</label>
            <div className="input-box">
              <input
                type="number"
                id="quota"
                name="quota"
                onChange={handleChange}
              />
            </div>
            {/* description */}
            <label htmlFor="description">Description</label>
            <div className="input-box">
              <textarea
                type="text"
                id="description"
                name="description"
                onChange={handleChange}
              ></textarea>
            </div>
            {/* image */}
            <div className="input-box file">
              <label>Image</label>
              <label htmlFor="image">
                <input
                  type="file"
                  id="image"
                  name="image"
                  className="file"
                  multiple
                  onChange={handleChange}
                />
                {/* <p className='text-avenir fw-900 fs-18 p-file'>Attach Here</p> */}
              </label>
            </div>
            <div className="w-100 text-center">
              <button
                className="btn-add-trip text-avenir fw-900 fs-18"
                type="submit"
              >
                Add Trip
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
