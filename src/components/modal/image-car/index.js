import { Carousel, Modal } from "react-bootstrap";

import * as React from "react";
import * as img from "../../../assets";

function ModalImage(props) {
  const images = [img.negara1, img.negara2, img.negara3];

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      {/* Carousel bootstrap */}
      <Carousel activeIndex={props.idx} onSelect={props.handleSelect}>
        {images.map((e, idx) => {
          return (
            <Carousel.Item key={idx}>
              <img src={e} alt="..." />
            </Carousel.Item>
          );
        })}
      </Carousel>
    </Modal>
  );
}

export default ModalImage;
