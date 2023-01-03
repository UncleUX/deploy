import { Fragment } from "react";
import AppHeader from "../Layout/AppHeader";
import AppSidebar from "../Layout/AppSidebar";

export default function Base ({ children }) {
  return (
    <Fragment>
      <AppHeader />
      <div className="app-main">
        <AppSidebar />
        <div className="app-main__outer">
          <div className="app-main__inner">
            {children}
          </div>
        </div>
      </div>
    </Fragment>
  )
}