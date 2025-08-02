import React from 'react';
import { RouterProvider } from "react-router-dom";
import { switchRoutes } from "./lib/constants/routes";
import "./App.css";
import useAuth from './hooks/useAuth';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [router, setRouter] = React.useState(null);
  const { user, loading } = useAuth(); // assuming your hook has loading

  React.useEffect(() => {
    if (user) {
      const routes = switchRoutes(user.role);
      setRouter(routes);
    }
  }, [user]);

  if (loading) {
    return <LoadingSpinner />; // Show loading spinner while auth is being checked
  }

  if (!router) {
    // when user is null (not logged in), show login route
    const loginRouter = switchRoutes("END_USER"); // fallback or guest routes
    return <RouterProvider router={loginRouter} />;
  }

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
