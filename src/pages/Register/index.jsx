import React, {Fragment, useEffect, useState} from "react";
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
import {faPhoneAlt, faKey, faEye, faEyeSlash, faUserAlt, faUserCircle} from '@fortawesome/free-solid-svg-icons'

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'
import { isValidPhoneNumber } from 'react-phone-number-input'
import {faEnvelope, faUser} from "@fortawesome/free-regular-svg-icons";
import Dropzone, {useDropzone} from "react-dropzone";
import mainService from "../../services/mainService";

export default function Register () {
  const [ loading, setLoading ] = useState(false)
  const [ name, setName ] = useState('')
  const [ sname, setSname ] = useState('')
  const [ uname, setUname ] = useState('')
  const [ fname, setFname ] = useState(false)
  const [ lname, setLname ] = useState(false)
  const [ email, setEmail ] = useState('')
  const [ phone, setPhone ] = useState('')
  const [ pError, setPhoneError ] = useState(false)
  const [ eError, setEmailError ] = useState(false)
  const [ iError, setImageError ] = useState(false)
  const [image, setImage] = useState([]);

  useEffect(() => {
    return () => image.forEach(file => URL.revokeObjectURL(file.preview));
  }, [image]);

  const isConnected = useSelector(isLoggedIn)

  const handleSubmit= (e) => {
    e.preventDefault();
    validForm()
    if(name === '') {
      setLname(true)
    }
    else if(sname === '') {
      setFname(true)
    }
    else if(email === '') {
      setEmailError(true)
    }
    else if(phone === '' || !isValidPhoneNumber(phone)) {
      setPhoneError(true)
    }
    else if(image.length <= 0) {
      setImageError(true)
    }
    else{
      validForm()
      setLoading(true)
      const formData = new FormData()

      formData.append("last_name", name)
      formData.append("first_name", sname)
      formData.append("pseudo", uname)
      formData.append("email", email)
      formData.append("phone", phone)
      formData.append("picture", image[0])

      mainService.createClient(formData).then((response) => {
        setLoading(false)
        swal("Compte client crée avec succès", "Vous allez recevoir un SMS de validation", "success").then(() => {
          window.location.href = "/"
        });
      }).catch((err) => {
        setLoading(false)
        let error = err.response.data.message
        console.log(error)
        if(error.includes("email")){
          swal("Erreur", "L'email est requis pour procéder", "error");
          setEmailError(true)
        }
        else if(error.includes("phone")){
          swal("Erreur", "Le numero de téléphone est déjà utiliser par un autre compte ou est invalide", "error");
          setPhoneError(true)
        }
        else if(error.includes("first_name")){
          swal("Erreur", "Le prénom est requis pour procéder", "error");
          setFname(true)
        }
        else if(error.includes("last_name")){
          swal("Erreur", "Le nom est requis pour procéder", "error");
          setLname(true)
        }
        else if(error.includes("picture")){
          swal("Erreur", "La photo de profil de l'administrateur est requis pour procéder", "error");
          setImageError(true)
        }
        else if(err.response.status === 409){
          swal("Erreur", err.response.data.message, "error");
        }
        else{
          swal("Erreur", "Une erreur s'est produite lors de l'execution de votre requete", "error");
        }
      })
    }
  }

  function validForm(){
    setPhoneError(false)
    setImageError(false)
    setEmailError(false)
    setFname(false)
    setLname(false)
  }

  function validate(str){
    return str.length > 0
  }

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    switch(name) {
      case 'password': setPassword(value); break;
      case 'confirm': setConfirm(value); break;
      case 'name': setName(value); break;
      case 'sname': setSname(value); break;
      case 'uname': setUname(value); break;
      case 'email': setEmail(value); break;
      case 'opening': setOpen(value); break;
      case 'closing': setClose(value); break;
      default: break;
    }
  }

  return (
    <Fragment>
      <div className="">
        <Row className="g-0 justify-content-center align-items-center h-100">
          
          <Col lg="12" style={{ height: '25%' }} className="pt-4 wazieats-bg-primary-color d-flex justify-content-center">
            <div className="text-light d-flex flex-column justify-content-center align-items-center">
              <div className="d-flex flex-column justify-content-center align-items-center">
                <img src={logo} alt="Logo wazieats" width="60" height="60" />
                <h3 className="fs-1 pt-3">Wazi<b>Food</b></h3><br/>
                <h3 className="fs-6 pb-3">Restaurant</h3>
              </div>
            </div>
          </Col>

          <Col lg="6" style={{ height: '75%', overflow: "auto" }} className="bg-white pt-md-0 pt-5 w-100 d-flex justify-content-center">
            <div className="text-dark d-flex flex-column justify-content-center align-items-center align-self-center pt-md-0 pt-5">
              <LoadingOverlay className="p-5" tag="div" active={loading}
                styles={{
                  overlay: (base) => ({
                    ...base,
                    background: "#fff",
                    opacity: 0.5,
                  }),
                }}
                spinner={<Loader active={loading} type='ball-pulse-rise' />}>
                <div className='d-flex justify-content-center pt-md-0 pt-5'>
                  <Form onSubmit={e => {handleSubmit(e)}} className='px-5 pt-md-0 pt-5 wd-50'>
                    <Row className="text-center pb-4 pt-md-0 pt-5">
                      <h2 className="fs-2 fw-bold pt-md-0 pt-5">Créer mon compte client</h2>
                    </Row>

                    <Row>

                      <Col md={12} className="">
                        <FormGroup>
                          <Label for="name">
                            Nom(s) du client *
                          </Label>
                          <Row>
                            <Col md={4}>
                              <InputGroup size="lg" className="mt-1">
                                <Input
                                    type={"text"}
                                    name="name"
                                    id="name"
                                    value={name}
                                    onChange={handleChange}
                                    style={{ backgroundColor: "#eee", borderColor: "#eee" }}
                                    bsSize="lg"
                                    placeholder="Noms"
                                    invalid={lname}/>
                                <InputGroupText style={{ color: "#000", backgroundColor: "#eee", borderColor: "#eee" }}>
                                  <FontAwesomeIcon style={{ cursor : "pointer" }} icon={faUser} />
                                </InputGroupText>
                              </InputGroup>
                              <FormFeedback className={ fname || lname ? "d-block": ""}>
                                Nom et Prénom requis
                              </FormFeedback>
                            </Col>
                            <Col md={4}>
                              <InputGroup size="lg" className="mt-1">
                                <Input
                                    type={"text"}
                                    name="sname"
                                    id="sname"
                                    value={sname}
                                    onChange={handleChange}
                                    style={{ backgroundColor: "#eee", borderColor: "#eee" }}
                                    bsSize="lg"
                                    placeholder="Prénoms"
                                    invalid={fname}/>
                                <InputGroupText style={{ color: "#000", backgroundColor: "#eee", borderColor: "#eee" }}>
                                  <FontAwesomeIcon style={{ cursor : "pointer" }} icon={faUserAlt} />
                                </InputGroupText>
                              </InputGroup>
                            </Col>
                            <Col md={4}>
                              <InputGroup size="lg" className="mt-1">
                                <Input
                                    type={"text"}
                                    name="uname"
                                    id="uname"
                                    value={uname}
                                    onChange={handleChange}
                                    style={{ backgroundColor: "#eee", borderColor: "#eee" }}
                                    bsSize="lg"
                                    placeholder="Pseudo"/>
                                <InputGroupText style={{ color: "#000", backgroundColor: "#eee", borderColor: "#eee" }}>
                                  <FontAwesomeIcon style={{ cursor : "pointer" }} icon={faUserCircle} />
                                </InputGroupText>
                              </InputGroup>
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>

                      <Col md={6} className="pt-3">
                        <FormGroup row>
                          <Label sm={12} for="image">
                            Photo de profil du client
                          </Label>

                          <FormFeedback className={ iError ? "d-block": ""}>
                            L'image est vide ou invalide
                          </FormFeedback>
                          <Dropzone
                              accept="image/*"
                              className="" onDrop={(acceptedFiles) => {
                            setImage(acceptedFiles.map(file => Object.assign(file, {
                              preview: URL.createObjectURL(file)
                            })));
                          }} name="image" multiple={false}>
                            {({getRootProps, getInputProps}) => (
                                <div {...getRootProps({className: 'wazi-dropzone'})}>
                                  <input {...getInputProps()} />
                                  <span style={{ fontSize: ".8rem" }}>
                                    Recherchez ou Déposer une photo ici
                                  </span>
                                </div>
                            )}
                          </Dropzone>
                          {
                            image.length > 0 ?
                                <Col sm={6} className="thumb-container pb-5">
                                  {
                                    image.map(file => (
                                        <div className='thumb' key={file.name}>
                                          <div className='thumb-inner'>
                                            <img
                                                style={{ width: '115px', height: '115px' }}
                                                src={file.preview}
                                                alt={file.name}
                                                onLoad={() => { URL.revokeObjectURL(file.preview) }}
                                            />
                                          </div>
                                        </div>
                                    ))
                                  }
                                </Col>
                                :
                                <></>
                          }
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Row className="pt-4">
                            <Col sm={12} className="mb-4">
                              <Label for="phone">
                                Téléphone Client *
                              </Label>
                              <Row noGutters className="mt-1" style={{ backgroundColor: "#eee", borderRadius: "5px" }}>
                                <Col sm={11}>
                                  <PhoneInput
                                      value={phone}
                                      onChange={(phone, data) => {
                                        setPhone("+" + phone)
                                        // let v = p.slice(data.dialCode.length)
                                        // console.log(phone)
                                        // setPhoneError(!isValidPhoneNumber(phone))
                                      }}
                                      inputProps={{
                                        name: 'phone',
                                        id: 'tel',
                                        required: true,
                                        autoFocus: true
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
                              <FormFeedback className={ pError ? "d-block": ""}>
                                Numéro de Téléphone invalide
                              </FormFeedback>
                            </Col>
                            <Col sm={12}>
                              <Label for="email">
                                Email Client
                              </Label>
                              <InputGroup size="lg" className="mt-1">
                                <Input
                                    autoComplete="false"
                                    type={"email"}
                                    name="email"
                                    id="email"
                                    onChange={handleChange}
                                    value={email}
                                    style={{ backgroundColor: "#eee", borderColor: "#eee" }}
                                    bsSize="lg"
                                    invalid={eError}
                                    placeholder="Email du client" />
                                <InputGroupText style={{ color: "#000", backgroundColor: "#eee", borderColor: "#eee" }}>
                                  <FontAwesomeIcon style={{ cursor : "pointer" }} icon={faEnvelope} />
                                </InputGroupText>
                              </InputGroup>
                              <FormFeedback className={ eError ? "d-block": ""}>
                                L'email est invalide
                              </FormFeedback>
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>

                    </Row>

                    <Row className="justify-content-center align-items-center">
                      <Col sm={12}>
                        <div className="d-flex flex-column">
                          <Button type="submit" size="md" block className="btn fw-bold btn-login">
                            Créer mon compte
                          </Button>
                        </div>
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-center mt-4 fw-bold text-dark">
                      J'ai déjà un compte ? &nbsp;
                      <a href="/login" className="wazieats-2-link">
                        Connectez-vous
                      </a>
                    </div>

                  </Form>
                </div>
              </LoadingOverlay>
            </div>
          </Col>
          
        </Row>
      </div>
    </Fragment>
  );
}
