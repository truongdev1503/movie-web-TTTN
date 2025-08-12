import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layouts/admin/auth";
import Login from "../pages/admin/login";
import DefaultLayout from "../layouts/admin/default";
import Film from "../pages/admin/film";
import FilmUser from "../pages/user/filmUser";
import DetailFilm from "../pages/user/filmUser/DetailFilm";
import DefaultUserLayout from "../layouts/user/defaultUser";
import MovieSearch from "../pages/user/searchFilm";
import GenresPage from "../pages/admin/genres";
import GenreBrowse from "../pages/user/genre";

const routes = createBrowserRouter([
  {
    path: '/',
    element: <DefaultUserLayout />,
    children: [
      {
        path: '/',
        element: <FilmUser />,
        
      },
      {
        path: '/genres',
        element: <GenreBrowse />
      },
      {
        path: '/genres/:genreId',
        element: <GenreBrowse />
      },
      {
        path:'/search',
        element: <MovieSearch/>
      },
      {
        path: 'film/:id',
        element: <DetailFilm />,
      },
    ]
  },
  {
    path: '/admin',
    element: <DefaultLayout />,
    children: [
      {
        path: 'film',
        element: <Film />
      },
      {
        path: 'genres',
        element: <GenresPage />
      }
    ]
  },
  {
    path: '/admin',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      }
    ]
  },
]);

export default routes;
