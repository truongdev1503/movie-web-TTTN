import { Outlet } from "react-router-dom";

const DefaultLayout = () => {
  return (
    <div className="default-layout">
      {/* Add your default layout components here, like header, footer, etc. */}
      <Outlet />
    </div>
  );
}

export default DefaultLayout;