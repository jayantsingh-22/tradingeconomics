const Loader = () => {
  return (
    <div className="d-flex text-primary justify-content-center align-items-center" style={{ height: "100%" }}>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
