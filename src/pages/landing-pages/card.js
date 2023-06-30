import { DataPerformances } from "../../data/data";

export default function CardPerformance() {
  return DataPerformances.map((data, idx) => {
    return (
      <div className="card-perform" key={idx}>
        <img src={data.logo} alt={data.logo} />
        <p className="title-perform">{data.performance}</p>
        <small className="desc-perform">{data.description}</small>
      </div>
    );
  });
}
