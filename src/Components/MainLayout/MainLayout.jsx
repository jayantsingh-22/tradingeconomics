import "./MainLayout.scss";

const Layout = (props) => {
  const { children } = props;

  return <div className="container-fluid">{children}</div>;
};

export default Layout;
