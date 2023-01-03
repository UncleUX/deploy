import React, { Fragment } from "react";

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  Nav,
  Button,
  NavItem,
} from "reactstrap";

import { faMailBulk } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import bg4 from "../../../assets/utils/images/dropdown-header/abstract4.jpg";

class HeaderDots extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
  }

  render() {
    return (
      <Fragment>
        <div className="header-dots">
          <UncontrolledDropdown>
            <DropdownToggle className="p-0" color="link">
              <div className="icon-wrapper icon-wrapper-alt rounded-circle">
                <div className="icon-wrapper-bg bg-success" />
                <i className="dot-btn-icon lnr-bullhorn icon-gradient bg-premium-dark" />
              </div>
            </DropdownToggle>
            <DropdownMenu end className="dropdown-menu-xl rm-pointers">
              <div className="dropdown-menu-header">
                <div className="dropdown-menu-header-inner bg-premium-dark">
                  <div className="menu-header-image"
                    style={{
                      backgroundImage: "url(" + bg4 + ")",
                    }}/>
                  <div className="menu-header-content text-white">
                    <h5 className="menu-header-title">Notifications</h5>
                    <h6 className="menu-header-subtitle">
                      Vous avez <span>20</span> messages non lus
                    </h6>
                  </div>
                </div>
              </div>
              <Nav vertical>
                <NavItem className="nav-item-btn text-center">
                  <Button size="sm" className="btn-shine btn-wide btn-pill wazi-btn">
                    <FontAwesomeIcon className="me-2" icon={faMailBulk} fixedWidth={false}/>
                    Voir les messages
                  </Button>
                </NavItem>
              </Nav>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </Fragment>
    );
  }
}

export default HeaderDots;
