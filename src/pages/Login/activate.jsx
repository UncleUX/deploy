import React, {Fragment, useEffect, useState} from "react";
import { Col, Row, Button, Form, FormGroup, Label, FormFeedback } from "reactstrap";
import logo from "../../assets/utils/images/logo.png";
import icon from "../../assets/check.png";
import error from "../../assets/error.png";
import { InputGroup, InputGroupText, Input } from 'reactstrap';
import { login } from "../../features/auth";
import { Loader } from "react-loaders";
import LoadingOverlay from "react-loading-overlay-ts";
import { useSelector } from "react-redux";
import { isLoggedIn } from "../../utils/selectors";

import swal from 'sweetalert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhoneAlt, faKey, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import queryString from 'query-string'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'
import mainService from "../../services/mainService";

export default function Activate () {

  const [ loading, setLoading ] = useState(false)

  const [ status, setStatus ] = useState(false)

  const [ message, setMessage ] = useState("")

  const params = new URL(window.location.href);
  const token = params.searchParams.get('token');
  const phone = params.searchParams.get('phone');

  useEffect(() => {
    setLoading(true)
    const formData = new FormData()
    formData.append("token", token)
    formData.append("phone", phone)
    mainService.activateAccount(formData)
          .then((response) => {
            setLoading(false)
            setStatus(true)
          })
          .catch((error) => {
            setLoading(false)
            setStatus(true)
            console.log(error)
          })
  }, []);

  return (
    <Fragment>
      <div className="">
        <Row className="g-0 justify-content-center align-items-center h-100">
          
          <Col lg="12" style={{ height: '30%' }} className="pt-4 wazieats-bg-primary-color d-flex justify-content-center">
            <div className="text-light d-flex flex-column justify-content-center align-items-center">
              <div className="d-flex flex-column justify-content-center align-items-center">
                <img src={logo} alt="Logo wazieats" width="60" height="60" />
                <h3 className="fs-1 pt-3">Wazi<b>Food</b></h3><br/>
                <h3 className="fs-6 pb-3">Restaurant</h3>
              </div>
            </div>
          </Col>

          <Col lg="6" style={{ height: '70%' }} className="bg-white w-100 d-flex justify-content-center">
            <div className="text-dark d-flex flex-column justify-content-center align-items-center">
              <LoadingOverlay className="p-5" tag="div" active={loading}
                styles={{
                  overlay: (base) => ({
                    ...base,
                    background: "#fff",
                    opacity: 0.5,
                  }),
                }}
                spinner={<Loader active={loading} type='ball-pulse-rise' />}>

                {
                  status ?
                      <>
                        <center><img src={icon} alt={"WaziEats"}/></center>
                        <br/>
                        <p className="text-center">
                          Votre compte <b>WaziEats</b> a déjà été activé et vos accès envoyé avec succès.
                        </p>
                        <br/>
                        <Button type="button" size="md" block className="btn btn-login mt-2">
                          <a href="/login" className="text-white fw-bold">
                            Connexion
                          </a>
                        </Button>
                      </>
                      :
                      <>
                        <center><img src={error} alt={"WaziEats"}/></center>
                        <br/>
                        <p className="text-center">
                          Votre compte <b>WaziEats</b> est en cours d'activation.
                        </p>
                        <br/>
                        <Button type="button" size="md" block className="btn btn-login mt-2">
                          <a href="/" className="text-white fw-bold">
                            Accueil
                          </a>
                        </Button>
                      </>
                }

              </LoadingOverlay>
            </div>
          </Col>
          
        </Row>
      </div>
    </Fragment>
  );
}
