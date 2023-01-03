import React, { Fragment, useState } from "react";
import { Col, Row, Button, Form, FormGroup } from "reactstrap";
import logo from "../../assets/utils/images/logo.png";
import { useSelector } from "react-redux";
import { isLoggedIn } from "../../utils/selectors";
import { Redirect } from "react-router-dom";
import { InputGroup, InputGroupText, Input, FormFeedback } from 'reactstrap';
import swal from 'sweetalert';
import { Loader } from "react-loaders";
import LoadingOverlay from "react-loading-overlay-ts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhoneAlt, faKey, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { reset } from "../../features/auth";

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'
import { isValidPhoneNumber } from 'react-phone-number-input'

export default function ForgotPassword () {
  const [ username, setUsername ] = useState('')
  const isConnected = useSelector(isLoggedIn)

  const [ loading, setLoading ] = useState(false)

  const [ error, setError ] = useState("Numéro téléphone invalide")

  const [ uname, setUname ] = useState(false)
  
  if (isConnected) {
    return <Redirect to='/' />
  }

  const handleSubmit= (e) => {
    e.preventDefault();
    let v = isValidPhoneNumber(username)
    if (v === false) {
      setUname(true)
      setError('Numéro de téléphone invalide pour ce pays')
    } else {
      setLoading(true) // Afficher le logo de chargement
      setUname(false) // Valider le champ email/telephone
      reset(username)
        .then((response) => { 
          setLoading(false)
          swal("SMS Envoyé", "Le lien de reinitialisation a été envoyé", "success");
        })
        .catch( error => {
          setLoading(false)
          setUname(true)
          setError("Ce numéro téléphone ne correspond à aucun compte")
        })
      }
  }

  function validate(str){
    return str.length > 0
  }

  return (
    <Fragment>
      <div>
        <Row className="bg-white g-0 h-100 justify-content-center align-items-center">
        
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
                <Form autoComplete="false" onSubmit={e => {handleSubmit(e)}} className='px-5'>
                  <Row className="text-center py-5 mb-3 mt-2">
                    <h2 class="fs-2">Réinitialiser mon mot de passe</h2>
                  </Row>
                  <Row>

                    <Col md={12}>
                        <FormGroup className="position-relative p-0">
                          <Row noGutters style={{ backgroundColor: "#eee", borderRadius: "5px" }}>
                              <Col md={11}>
                                <PhoneInput
                                  value={username}
                                  onChange={(phone, data) => {
                                    setUsername("+" + phone)
                                    let v = phone.slice(data.dialCode.length)
                                    setUname(!validate(v))
                                    setError("Numéro téléphone vide")
                                  }}
                                  inputProps={{
                                    name: 'phone',
                                    id: 'tel',
                                    required: true,
                                    autoccFocus: true
                                  }}
                                  preferredCountries={["cm"]}
                                  enableSearch="true"
                                  className="p-0"
                                  country={'cm'} />
                              </Col>
                              <Col md={1} id="phoneIcon" className="text-center align-self-center d-none d-md-block"
                               >
                                <FontAwesomeIcon style={{ color: "#000" }} icon={faPhoneAlt} />
                              </Col>
                          </Row>
                          <FormFeedback className={ uname ? "d-block": ""}>
                            {error}
                          </FormFeedback>
                        </FormGroup>
                    </Col>
                  </Row>
                  
                  <div className="d-flex align-items-center flex-column">
                    <Button type="submit" size="lg" block className="btn btn-login">
                      Réinitialiser le mot de passe
                    </Button>
                  </div>

                  <div className="d-flex text-dark fw-bold justify-content-center mt-5">
                    Retour à la &nbsp; <a href="/login" className="wazieats-2-link">
                      page de connexion
                    </a>
                  </div>

                </Form>
              </LoadingOverlay>
            </div>
          </Col>
        
        </Row>
      </div>
    </Fragment>
  );
}
