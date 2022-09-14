import React from "react";

import { Redirect, Route } from "react-router-dom";
import { useSelector } from "react-redux";

function RedirectRoute({ component: Component, ...rest }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  );
}

export default RedirectRoute;
