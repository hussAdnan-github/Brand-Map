import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import Login from "../pages/login/page";
import Register from "../pages/register/page";
import Dashboard from "../pages/dashboard/page";
import NewBrandMap from "../pages/brand-map-new/page";
import BrandMapPlay from "../pages/brand-map-play/page";
import BrandMapOutput from "../pages/brand-map-output/page";
import TeamRoom from "../pages/team-room/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/brand-map/new",
    element: <NewBrandMap />,
  },
  {
    path: "/brand-map/:id",
    element: <BrandMapPlay />,
  },
  {
    path: "/brand-map/:id/team",
    element: <TeamRoom />,
  },
  {
    path: "/brand-map/:id/output",
    element: <BrandMapOutput />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;