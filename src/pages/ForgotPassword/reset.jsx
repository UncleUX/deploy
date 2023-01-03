import React, { Fragment, useState } from "react";
import { Col, Row, Button, Form, FormGroup, Label, FormFeedback } from "reactstrap";
import logo from "../../assets/utils/images/logo.png";
import { InputGroup, InputGroupText, Input } from 'reactstrap';
import {login, resetPassword} from "../../features/auth";
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

export default function ResetPass () {
  const [ password, setPassword ] = useState('')
  const [ confirm, setConfirm ] = useState('')
  const [ loading, setLoading ] = useState(false)

  const [ pass, setPass ] = useState(false)
  const [ conf, setConf ] = useState(false)

  const [ error, setError ] = useState("Mot de passe invalide")

  const [ show, setShow ] = useState(false)
  const [ view, setView ] = useState(false)

  const params = new URL(window.location.href);
  const token = params.searchParams.get('token');

  const handleSubmit= (e) => {
    e.preventDefault();

    if(!validateLength(password)){
      setPass(true)
      setError("le mot de passe doit contenir au moins 8 caractères")
    }
    else if(!containsDigit(password)){
      setPass(true)
      setError("le mot de passe doit contenir au moins 1 chiffre(0-9)")
    }
    else if(!containsUppercase(password)){
      setPass(true)
      setError("le mot de passe doit contenir au moins une majuscule(A-Z)")
    }
    else if(!containsSpecialChars(password)){
      setPass(true)
      setError("le mot de passe doit contenir au moins un symbole spécial")
    }
    else if(password !== confirm){
      setError("Mots de passe non identiques")
      setPass(true)
      setConf(true)
    }
    else if(!token){
      setError("Le token de reinitialisation est invalide")
    }
    else {
      // setLoading(true) // Afficher le logo de chargement
      setConf(false) // Valider le champ email/telephone
      setPass(false) // Valider le champ mot de passe
      setError(null)
      resetPassword(token, password, confirm)
          .then((response) => {
            setLoading(false)
            swal("Reinitialisation", "Mot de passe réinitialisé avec succès", "success").then(() => {
              window.location.href = "/"
            });
          })
          .catch( error => {
            setLoading(false)
            swal("Erreur!", error.response.data.message, "error");
          })
    }
  }

  function validate(str){
    return validateLength(str) && containsUppercase(str) && containsDigit(str) && containsSpecialChars(str)
  }

  function validateLength(str){
    return str.length > 8
  }

  function containsUppercase(str) {
    return /[A-Z]/.test(str);
  }

  function containsLowercase(str) {
    return /[a-z]/.test(str);
  }

  function containsSpecialChars(str) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
  }

  function containsDigit(str) {
    return /[0-9]/.test(str);
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
                      <h2 className="fs-3 fw-bold">Réinitialiser mon mot de passe</h2>
                    </Row>
                    <Row>

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
                                  console.log(validate(e.target.value))
                                  setPass(!validate(e.target.value))
                                }}/>
                            <InputGroupText onClick={() => setShow(!show)} style={{ color: "#000", backgroundColor: "#eee", borderColor: "#eee" }}>
                              { show ? <FontAwesomeIcon style={{ cursor : "pointer" }} icon={faEyeSlash} /> : <FontAwesomeIcon style={{ cursor : "pointer" }} icon={faEye} /> }
                            </InputGroupText>
                          </InputGroup>
                          <FormFeedback className="text-muted d-block">
                            Le mot de passe doit contenir au moins une majuscule<br/>
                            Le mot de passe doit contenir au moins un chiffre (0-9)<br/>
                            Le mot de passe doit contenir au moins 8 caractères<br/>
                            Le mot de passe doit contenir un symbole(&lt;&gt;()[]{}|\\`~!@#$%^&*_-+=;:\'",>./?)<br/>
                          </FormFeedback>
                        </FormGroup>
                      </Col>

                      <Col md={12}>
                        <FormGroup className="position-relative">
                          <InputGroup size="lg" className="mt-1">
                            <Input
                                type={ view ? "text" : "password"}
                                name="confirm"
                                id="confirm"
                                value={confirm}
                                style={{ backgroundColor: "#eee", borderColor: "#eee" }}
                                bsSize="lg"
                                placeholder="Confirmez le mot de passe"
                                invalid={conf}
                                onChange={(e) => {
                                  setConfirm(e.target.value)
                                  setConf(!validate(e.target.value))
                                }}/>
                            <InputGroupText onClick={() => setView(!view)} style={{ color: "#000", backgroundColor: "#eee", borderColor: "#eee" }}>
                              { view ? <FontAwesomeIcon style={{ cursor : "pointer" }} icon={faEyeSlash} /> : <FontAwesomeIcon style={{ cursor : "pointer" }} icon={faEye} /> }
                            </InputGroupText>
                          </InputGroup>
                          <FormFeedback className={ error ? "d-block": ""}>
                            {error}
                          </FormFeedback>
                        </FormGroup>
                      </Col>

                    </Row>

                    <Row className="justify-content-center mt-4 align-items-center">
                      <Col sm={12}>
                        <div className="d-flex flex-column">
                          <Button type="submit" size="md" block className="btn fw-bold btn-login">
                            Changer mon mot de passe
                          </Button>
                        </div>
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-center mt-4 fw-bold text-dark">
                      J'ai déjà un compte restaurant ? &nbsp; <a href="/login" className="wazieats-2-link">
                      Connexion
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
