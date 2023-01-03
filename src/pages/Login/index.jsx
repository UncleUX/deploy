import React, { Fragment, useState } from "react";
import { Col, Row, Button, Form, FormGroup, Label, FormFeedback } from "reactstrap";
import logo from "../../assets/utils/images/logo.png";
import { InputGroup, InputGroupText, Input } from 'reactstrap';
import { login } from "../../features/auth";
import { Loader } from "react-loaders";
import LoadingOverlay from "react-loading-overlay-ts";
import { useSelector } from "react-redux";
import { isLoggedIn } from "../../utils/selectors";
import { Redirect } from "react-router-dom";

import swal from 'sweetalert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhoneAlt, faKey, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'
import { isValidPhoneNumber } from 'react-phone-number-input'

export default function Login () {
  const [ username, setUsername ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ loading, setLoading ] = useState(false)

  const [ uname, setUname ] = useState(false)
  const [ pass, setPass ] = useState(false)

  const [ error, setError ] = useState("")

  const [ show, setShow ] = useState(false)

  const isConnected = useSelector(isLoggedIn)
  
  if (isConnected) {
    return <Redirect to='/' />
  }

  const handleSubmit= (e) => {
    e.preventDefault();
    
    if(username == ''){
      setUname(true)
    }
    else if(password == ''){
      setPass(true)
    }
    else {
      setLoading(true) // Afficher le logo de chargement
      setUname(false) // Valider le champ email/telephone
      setPass(false) // Valider le champ mot de passe
      login(username, password)
        .then((response) => { 
          window.location = '/'
          setLoading(false)
        })
        .catch( error => {
          setLoading(false)
          swal("Erreur!", "Vos informations d'authentification sont incorrectes", "error");
        })
    }
  }

  function validate(str){
    return str.length > 0
  }

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
                <Form onSubmit={e => {handleSubmit(e)}} className='px-5'>
                  <Row className="text-center pb-4">
                    <h2 className="fs-3 fw-bold">Bienvenue</h2>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <FormGroup className="position-relative">
                        
                        <Row noGutters style={{ backgroundColor: "#eee", borderRadius: "5px" }}>
                              <Col sm={11}>
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
                              <Col sm={1} id="phoneIcon" className="text-center align-self-center d-none d-md-block">
                                <FontAwesomeIcon style={{ color: "#000" }} icon={faPhoneAlt} />
                              </Col>
                        </Row>

                        <FormFeedback className={ uname ? "d-block": ""}>
                          Numéro de Téléphone invalide
                        </FormFeedback>
                      </FormGroup>
                    </Col>

                    <Col md={12}>
                      <FormGroup className="position-relative">
                        <InputGroup size="lg" className="mt-1">
                          <Input
                            type={ show ? "text" : "password"} 
                            name="password" 
                            id="password" 
                            value={password}
                            style={{ backgroundColor: "#eee", borderColor: "#eee" }}
                            bsSize="lg"
                            placeholder="Mot de passe"
                            invalid={pass}
                            onChange={(e) => {
                              setPassword(e.target.value)
                              setPass(!validate(e.target.value))
                            }}/>
                            <InputGroupText onClick={() => setShow(!show)} style={{ color: "#000", backgroundColor: "#eee", borderColor: "#eee" }}>
                              { show ? <FontAwesomeIcon style={{ cursor : "pointer" }} icon={faEyeSlash} /> : <FontAwesomeIcon style={{ cursor : "pointer" }} icon={faEye} /> }
                            </InputGroupText>
                        </InputGroup>
                        <FormFeedback className={ pass ? "d-block": ""}>
                          Mot de passe invalide
                        </FormFeedback>
                      </FormGroup>
                    </Col>

                  </Row>

                  <div className="d-flex justify-content-end mt-2 mb-4">
                    <a href="/forgot-password" className="text-dark fw-bold">
                      Mot de passe oublié ?
                    </a>
                  </div>
                  
                  <Row className="justify-content-center align-items-center">
                    <Col sm={12}>
                      <div className="d-flex flex-column">
                        <Button type="submit" size="md" block className="btn fw-bold btn-login">
                          Connexion
                        </Button>
                      </div>
                    </Col>
                    <Col sm={12}>
                      <div className="d-flex flex-column">
                        <Button type="button" size="md" block className="btn btn-login mt-2">
                          <a href="/vendor" className="text-white fw-bold">
                            Devenir un restaurant
                          </a>
                        </Button>
                      </div>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-center mt-4 fw-bold text-dark">
                    Pas de compte ? &nbsp; <a href="/register" className="wazieats-2-link">
                      Créer un compte client
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
