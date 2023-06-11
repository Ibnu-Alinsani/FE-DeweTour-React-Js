import { useState } from "react";
import { Container, Form, Button, Modal } from "react-bootstrap";
import { useMutation } from "react-query";
import { API } from "../../../config/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function AddCountry(props) {
  const [country, setCountry] = useState({
    name: "",
  });


  const handleChange = (e) => {
    setCountry({
      ...country,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitAdd = useMutation(async (e) => {
    // e.PreventDefault();
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const body = JSON.stringify(country);

      const response = API.post("/add-country", body, config);
      Swal.fire({
        title: "Success",
        text: `Add Country Success`,
        icon: "success",
      });
      props.modal(false)
      console.log("Success", response);
    } catch (error) {
      console.log("failed ", error);
    }
  });

  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Container className="p-5">
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="text"
                placeholder="Enter Country"
                name="name"
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
          <Button
            type="submit"
            className="m-0 text-white mt-2"
            variant="warning"
            style={{ width: "10rem" }}
            onClick={(e) => handleSubmitAdd.mutate(e)}
          >
            Add
          </Button>
        </Container>
      </Modal>
    </>
  );
}
export default AddCountry;
