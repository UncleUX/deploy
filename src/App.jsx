import React, {Fragment, useState} from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import cx from "classnames";
import { withRouter } from "react-router-dom";
import Register from './pages/Register';
import Login from './pages/Login';
import Activate from './pages/Login/activate';
import Vendor from './pages/Vendor';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from "./pages/Dashboard";
import Menu from "./pages/Menu";
import Plates from './pages/Plates';
import Drinks from './pages/Drinks';
import Error from './pages/Error';
import { ChakraProvider } from '@chakra-ui/react'
import { ToastContainer } from "react-toastify";
import { extendTheme } from "@chakra-ui/react"

import ResizeDetector from "react-resize-detector";
import PlateContext from "./context/selectPlates";
import ResetPass from "./pages/ForgotPassword/reset";


function App(props) {
  let {
    colorScheme,
    enableFixedHeader,
    enableFixedSidebar,
    enableFixedFooter,
    enableClosedSidebar,
    closedSmallerSidebar,
    enableMobileMenu,
    enablePageTabsAlt,
  } = props;

  const theme = extendTheme({
    colors: {
      brand: {
        primary: "#0ab44e",
        secondary: "#f8b545"
      },
      primary: {
        _default: '#0ab44e',
      }
    },
  })

  const [plate, setPlate] = useState([]);

  return (
    
      <ResizeDetector
          handleWidth
          render={({ width }) => (
            <Fragment>
              <ChakraProvider theme={theme}>
                <PlateContext.Provider value={{ plate, setPlate}}>
                  <div
                    className={cx(
                      "app-container app-theme-" + colorScheme,
                      { "fixed-header": enableFixedHeader },
                      { "fixed-sidebar": enableFixedSidebar || width < 1250 },
                      { "fixed-footer": enableFixedFooter },
                      { "closed-sidebar": enableClosedSidebar || width < 1250 },
                      {
                        "closed-sidebar-mobile": closedSmallerSidebar || width < 1250,
                      },
                      { "sidebar-mobile-open": enableMobileMenu },
                      { "body-tabs-shadow-btn": enablePageTabsAlt }
                    )}>
                      <Switch>
                        <Route exact path="/" component={Dashboard} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/activate" component={Activate} />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/vendor" component={Vendor} />
                        <Route exact path="/forgot-password" component={ForgotPassword} />
                        <Route exact path="/reset-password" component={ResetPass} />
                        <Route exact path="/menus" component={Menu} />
                        <Route exact path="/plates" component={Plates} />
                        <Route exact path="/drinks" component={Drinks} />
                        <Route path="*" component={Error} />
                      </Switch>
                  </div>
                  <ToastContainer/>
                </PlateContext.Provider>
              </ChakraProvider>
            </Fragment>
          )}
        />

  )

}

const mapStateToProp = (state) => ({
  colorScheme: state.ThemeOptions.colorScheme,
  enableFixedHeader: state.ThemeOptions.enableFixedHeader,
  enableMobileMenu: state.ThemeOptions.enableMobileMenu,
  enableFixedFooter: state.ThemeOptions.enableFixedFooter,
  enableFixedSidebar: state.ThemeOptions.enableFixedSidebar,
  enableClosedSidebar: state.ThemeOptions.enableClosedSidebar,
  enablePageTabsAlt: state.ThemeOptions.enablePageTabsAlt,
});

export default withRouter(connect(mapStateToProp)(App));
//export default App;