import React, { KeyboardEventHandler, Fragment, useEffect, useState } from "react";
import {Col, Row, Button, Form, FormGroup, Label, FormFeedback, FormText} from "reactstrap";
import logo from "../../assets/utils/images/logo.png";
import doc from "../../assets/doc.webp"
import { login } from "../../features/auth";
import { Loader } from "react-loaders";
import LoadingOverlay from "react-loading-overlay-ts";
import { useSelector } from "react-redux";
import { isLoggedIn } from "../../utils/selectors";
import { Redirect } from "react-router-dom";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faArrowRight,
  faStore,
  faStoreAlt,
  faFileContract,
  faUserCog,
  faMapPin,
  faGlobeAfrica,
  faEyeSlash, faEye, faUserAlt, faPhoneAlt
} from '@fortawesome/free-solid-svg-icons'
import { InputGroup, InputGroupText, Input } from 'reactstrap';
import CreatableSelect from 'react-select/creatable';
import { useDropzone } from 'react-dropzone';
import Dropzone from "react-dropzone";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import {faEnvelope, faUser} from "@fortawesome/free-regular-svg-icons";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/bootstrap.css'
import { isValidPhoneNumber } from 'react-phone-number-input'
import foodService from "../../services/foodService";
import drinkService from "../../services/drinkService";
import { Spinner } from '@chakra-ui/react'
import mainService from "../../services/mainService";
import swal from "sweetalert";


const components = {
  DropdownIndicator: null,
};

const createOption = (label) => ({
  label,
  value: label,
});


export default function Login () {
  const [ confirm, setConfirm ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ passError, setPassError ] = useState('')
  const [ loading, setLoading ] = useState(false)

  const [ rname, setRname ] = useState('')
  const [ vrname, setVRname ] = useState(false)

  const [ name, setName ] = useState('')
  const [ sname, setSname ] = useState('')
  const [ vname, setVname ] = useState(false)

  const [ open, setOpen ] = useState('08:00:00')
  const [ close, setClose ] = useState('20:00:00')
  const [ oHour, setOhour ] = useState(false)
  const [ cHour, setChour ] = useState(false)

  const [ long, setLong ] = useState('0')
  const [ lat, setLat ] = useState('0')

  const [tabIndex, setTabIndex] = useState(0)

  const handleTabsChange = (index) => {
    setTabIndex(index)
  }

  const nextTab = () => {
      setTabIndex((tabIndex <= 3) ? tabIndex + 1 : 3)
  }

  const prevTab = () => {
      setTabIndex((tabIndex >= 0) ? tabIndex - 1 : 0)
  }

  const [profile, setProfile] = useState([]);
  const [picture, setPicture] = useState([]);
  const [cni, setCNI] = useState([]);
  const [rccm, setRCCM] = useState([]);
  const [immatriculation, setImmatriculation] = useState([]);
  const [image, setImage] = useState([]);

  const {
    getRootProps,
    getInputProps
  } = useDropzone({
    multiple: false,
    onDrop: acceptedFiles => {
      setProfile(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    },
  });

  useEffect(() => {
    return () => profile.forEach(file => URL.revokeObjectURL(file.preview));
  }, [profile]);

  const isConnected = useSelector(isLoggedIn)

  const getValidUrl = (url = "") => {
    let newUrl = window.decodeURIComponent(url);
    newUrl = newUrl.trim().replace(/\s/g, "");

    if(/^(:\/\/)/.test(newUrl)){
      return `http${newUrl}`;
    }
    if(!/^(f|ht)tps?:\/\//i.test(newUrl)){
      return `http://${newUrl}`;
    }

    return newUrl;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if(rname === '') {
      setVRname(true)
      setTabIndex(0)
    }
    else if(phone === '' || !isValidPhoneNumber(phone)) {
      setPhoneError(true)
      setTabIndex(2)
    }
    else if(name === '') {
      setVname(true)
      setTabIndex(2)
    }
    // else if(password !== confirm){
    //   setPassError(true)
    //   setTabIndex(2)
    // }
    else{
      setPhoneError(false)
      setVRname(false)
      setVname(false)
      setLoading(true)
      const formData = new FormData()

      formData.append("name", rname)
      formData.append("opening_hour", open)
      formData.append("closing_hour", close)
      formData.append("location[0]", long)
      formData.append("location[1]", lat)
      formData.append("profile_picture", profile[0])

      formData.append("immatriculation", immatriculation)
      formData.append("rccm_document", rccm[0])
      formData.append("cni", cni[0])
      for(let i = 0; i < picture.length; i++){
        formData.append('picture_restaurant['+ i +']image', picture[i])
      }

      formData.append("restaurant_channel", channel)
      for(let i = 0; i < module.length; i++){
        formData.append('module', module[i])
      }
      for(let i = 0; i < fType.length; i++){
        formData.append('foodType', fType[i])
      }
      for(let i = 0; i < fCategory.length; i++){
        formData.append('foodCategory', fCategory[i])
      }
      for(let i = 0; i < dType.length; i++){
        formData.append('drinkType', dType[i])
      }
      for(let i = 0; i < dCategory.length; i++){
        formData.append('drinkCategory', dCategory[i])
      }

      formData.append("email", email)
      formData.append("phone", phone)
      formData.append("first_name", sname)
      formData.append("last_name", name)
      formData.append("picture", image[0])

      formData.append("internet_site", getValidUrl(web))
      for(let i = 0; i < value.length; i++){
        formData.append('social_network_link[' + i + ']', getValidUrl(value[i].value))
      }

      mainService.createRestaurant(formData).then((response) => {
        setLoading(false)
        swal("Restaurant crée avec succès", "Vous allez recevoir un SMS de validation", "success").then(() => {
          window.location.href = "/"
        });
      }).catch((err) => {
        setLoading(false)
        let error = err.response.data.message
        console.log(error)
        if(error.includes("email")){
          swal("Erreur", "L'email de l'administrateur est requis pour procéder", "error");
          setTabIndex(2)
        }
        else if(error.includes("phone")){
          swal("Erreur", "Le numero de téléphone est déjà utiliser par un autre compte", "error");
          setTabIndex(2)
        }
        else if(error.includes("rccm_document")){
          swal("Erreur", "Le document RCCM est requis pour procéder", "error");
          setTabIndex(1)
        }
        else if(error.includes("profile_picture")){
          swal("Erreur", "La photo de profil du restaurant est requis pour procéder", "error");
          setTabIndex(0)
        }
        else if(error.includes("picture")){
          swal("Erreur", "La photo de profil de l'administrateur est requis pour procéder", "error");
          setTabIndex(2)
        }
        else if(error.includes("internet_site")){
          swal("Erreur", "L'adresse du site web est requis pour procéder", "error");
          setTabIndex(3)
        }
        else if(error.includes("picture_restaurant")){
          swal("Erreur", "Une photo du restaurant est requis pour procéder", "error");
          setTabIndex(1)
        }
        else if(error.includes("social_network_link")){
          swal("Erreur", "Un lien de réseau social est requis pour procéder", "error");
          setTabIndex(3)
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

  const { isOpen, onOpen, onClose } = useDisclosure()

  const MyMapComponent = withScriptjs(withGoogleMap((props) =>
      <GoogleMap
        onClick={(ev) => {
          setLat(ev.latLng.lat());
          setLong(ev.latLng.lng());
          onClose()
        }}
        defaultZoom={5}
        defaultCenter={{lat: 4.061536, lng: 9.786072}}/>
  ))

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    switch(name) {
      case 'password': setPassword(value); break;
      case 'confirm': setConfirm(value); break;
      case 'name': setName(value); break;
      case 'immatriculation': setImmatriculation(value); break;
      case 'sname': setSname(value); break;
      case 'rname': setRname(value); break;
      case 'email': setEmail(value); break;
      case 'opening': setOpen(value); break;
      case 'closing': setClose(value); break;
      case 'website': setWeb(value); break;
      default: break;
    }
  }

  const [ show, setShow ] = useState(false)
  const [ view, setView ] = useState(false)

  const [ email, setEmail ] = useState('')
  const [ phone, setPhone ] = useState('')
  const [ pError, setPhoneError ] = useState(false)

  const [ fCategory, setFcategory ] = useState([1])
  const [ fType, setFtype ] = useState([1])
  const [ dCategory, setDcategory ] = useState([1, 3, 4, 5])
  const [ dType, setDtype ] = useState([1, 2, 3, 4])
  const [ module, setModule ] = useState([1, 3])
  const [ channel, setChannel ] = useState(2)

  const [ web, setWeb ] = useState("")
  const [ social, setSocial ] = useState("")

  const [value, setValue] = React.useState([]);

  const handleKeyDown = (event) => {
    if (!social) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        setValue((prev) => [...prev, createOption(social)]);
        setSocial('');
        event.preventDefault();
    }
  };

  // useEffect(() => {
  //   foodService.getFoodCategory()
  //       .then((response) => {
  //         setFcategory(response.data)
  //       })
  //       .catch((error) => {
  //         console.log(error)
  //       })
  //
  //   foodService.getFoodType()
  //       .then((response) => {
  //         setFtype(response.data)
  //       })
  //       .catch((error) => {
  //         console.log(error)
  //       })
  //
  //   drinkService.getDrinkCategory()
  //       .then((response) => {
  //         setDcategory(response.data)
  //       })
  //       .catch((error) => {
  //         console.log(error)
  //       })
  //
  //   drinkService.getDrinkType()
  //       .then((response) => {
  //         setDtype(response.data)
  //       })
  //       .catch((error) => {
  //         console.log(error)
  //       })
  //
  //   console.log(fCategory)
  //   console.log(fType)
  //   console.log(dCategory)
  //   console.log(dType)
  //
  // }, [])

  return (
      <Fragment>
        <div className="h-100">
          <Row className="h-100 g-0">

            <Col lg="5" className="d-none d-lg-block">
              <div className="wazieats-bg-primary-color text-light h-100 d-flex flex-column justify-content-center align-items-center">
                <div className="d-flex flex-column mb-3 justify-content-center align-items-center">
                  <img src={logo} alt="Logo wazieats" width="60" height="60" />
                  <h1 style={{ fontSize:"3rem" }} className="pb-1 pt-3">Wazi<b style={{ fontWeight: "900"}}>Food</b></h1><br/>
                  <span className="fs-4">Food Delivery</span>
                </div>
                <h1 style={{ fontSize:"5rem" }} className="fw-bold mt-5">Bienvenue</h1>
                <p className="fs-2 mt-3">Nous sommes heureux de vous revoir</p>
              </div>
            </Col>

            <Col lg="7" md="12" className="h-100 bg-white justify-content-center align-items-center">

              <LoadingOverlay tag="div" active={loading}
                              styles={{
                                overlay: (base) => ({
                                  ...base,
                                  background: "#fff",
                                  opacity: 0.5,
                                }),
                              }}
                              spinner={<Loader active={loading} type='ball-pulse-rise' />}>

                <Form className="px-4">

                  <Row className="g-0 justify-content-center h-100">

                    <Col lg={12} style={{ height: '15%' }}>
                      <Row className="text-center py-5">
                        <h2 className="fs-1 fw-bold">Créer un restaurant</h2>
                      </Row>
                    </Col>

                    <Col lg={12} className="bg-white" style={{ height: '75%' }}>

                      <Tabs style={{ height: "85%" }} variant="soft-rounded" isFitted colorScheme="green" index={tabIndex} onChange={handleTabsChange}>

                        <TabList>
                          <Tab><span className="d-sm-block d-none">Restaurant</span> <span className="d-block d-sm-none"><FontAwesomeIcon icon={faStore} /></span></Tab>
                          <Tab><span className="d-sm-block d-none">Verification</span> <span className="d-block d-sm-none"><FontAwesomeIcon icon={faFileContract} /></span></Tab>
                          <Tab><span className="d-sm-block d-none">Administrateur</span> <span className="d-block d-sm-none"><FontAwesomeIcon icon={faUserCog} /></span></Tab>
                          <Tab><span className="d-sm-block d-none">Liens Sociaux</span> <span className="d-block d-sm-none"><FontAwesomeIcon icon={faGlobeAfrica} /></span></Tab>
                        </TabList>

                        <TabPanels style={{ minWidth: '100%' }}>

                          <TabPanel>
                            <Row className="py-5">

                              <Col md={12}>
                                <FormGroup className="position-relative">
                                  <Label for="name">
                                    Nom du restaurant *
                                  </Label>
                                  <InputGroup size="lg" className="mt-1">
                                    <Input
                                        type={"text"}
                                        name="rname"
                                        id="rname"
                                        value={rname}
                                        onChange={handleChange}
                                        style={{ backgroundColor: "#eee", borderColor: "#eee" }}
                                        bsSize="lg"
                                        placeholder="Nom"
                                        invalid={vrname}/>
                                    <InputGroupText style={{ color: "#000", backgroundColor: "#eee", borderColor: "#eee" }}>
                                      <FontAwesomeIcon style={{ cursor : "pointer" }} icon={faStoreAlt} />
                                    </InputGroupText>
                                  </InputGroup>
                                  <FormFeedback className={ vrname ? "d-block": ""}>
                                    Nom du restaurant requis
                                  </FormFeedback>
                                </FormGroup>
                              </Col>
                              <Col md={12} className="my-4">
                                <FormGroup>
                                  <Label for="username">
                                    Horaire d'activité
                                  </Label>
                                  <Row>
                                    <Col>
                                      <Input
                                          type="time"
                                          step="2"
                                          name="opening"
                                          id="opening"
                                          onChange={handleChange}
                                          style={{ backgroundColor: "#eee", borderColor: "#eee" }}
                                          value={open}
                                          bsSize="lg"
                                          placeholder="Heure d'ouverture" />
                                    </Col>
                                    <Col>
                                      <Input
                                          type="time"
                                          step="1"
                                          name="closing"
                                          id="closing"
                                          onChange={handleChange}
                                          style={{ backgroundColor: "#eee", borderColor: "#eee" }}
                                          value={close}
                                          bsSize="lg"
                                          placeholder="Heure de fermeture" />
                                    </Col>
                                  </Row>
                                </FormGroup>
                              </Col>
                              <Col md={6}>
                                <FormGroup row>
                                  <Label sm={12} for="profile">
                                    Photo de profil du restaurant
                                  </Label>
                                  <Col sm={6} {...getRootProps({ className: 'wazi-dropzone2' })}>
                                    <input {...getInputProps()} type="file" name="profile" id="profile" />
                                    <FormText color="muted">
                                      Rechercher ou Déposer une photo ici
                                    </FormText>
                                  </Col>
                                  {
                                    profile.length > 0 ?
                                        <Col sm={6} className="thumb-container pb-5">
                                          {
                                            profile.map(file => (
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
                                  <Label for="username">
                                    Coordonnées de restaurant
                                  </Label>
                                  <Row className="mt-5 mb-4">
                                    <Col>
                                      <Input
                                          type="text"
                                          name="long"
                                          id="long"
                                          style={{ backgroundColor: "#eee", borderColor: "#eee" }}
                                          value={long}
                                          bsSize="lg"
                                          readOnly={true}
                                          placeholder="Longitude" />
                                    </Col>
                                    <Col>
                                      <Input
                                          type="text"
                                          name="lat"
                                          id="lat"
                                          style={{ backgroundColor: "#eee", borderColor: "#eee" }}
                                          value={lat}
                                          bsSize="lg"
                                          readOnly={true}
                                          placeholder="Latitude" />
                                    </Col>
                                  </Row>
                                  <Button type="button" onClick={onOpen} size="md" className="fw-bold btn btn-login" block>
                                    <FontAwesomeIcon icon={faMapPin} /> &nbsp; Ouvrir la carte
                                  </Button>
                                </FormGroup>
                              </Col>

                              <Modal isOpen={isOpen} onClose={onClose} size={'5xl'}>
                                <ModalOverlay />
                                <ModalContent>
                                  <ModalHeader><b>Carte de géolocalisation</b></ModalHeader>
                                  <ModalCloseButton />

                                  <ModalBody>
                                    <MyMapComponent
                                        isMarkerShown
                                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBScVzghtFm_hSY6OCoa0AKu79dHgSK2Ks&v=3.exp&libraries=geometry,drawing,places"
                                        loadingElement={<div style={{ height: `100%` }} />}
                                        containerElement={<div style={{ height: `400px` }} />}
                                        mapElement={<div style={{ height: `100%` }} />}
                                    />
                                    <br/>
                                    <div className="text-center py-4">
                                      Cliquez sur l'emplacement sur la carte pour enregistrer les coordonnées
                                    </div>
                                  </ModalBody>

                                  <ModalFooter>
                                    <Button size={'lg'} className="fw-bold btn btn-login" block>Enregistrer les cordonnées</Button>
                                  </ModalFooter>
                                </ModalContent>
                              </Modal>

                            </Row>
                          </TabPanel>

                          <TabPanel>
                            <div className="py-5" style={{ overflowX: "hidden", maxHeight: "500px", overflowY: "auto" }}>
                              <Row className="px-3">

                                <Col className="mb-4" md={12}>
                                  <FormGroup className="position-relative">
                                    <Label for="name">
                                      Numero d'immatriculation
                                    </Label>
                                    <Input
                                        type={"text"}
                                        name="immatriculation"
                                        id="immatriculation"
                                        onChange={handleChange}
                                        value={immatriculation}
                                        style={{ backgroundColor: "#eee", borderColor: "#eee" }}
                                        bsSize="lg"
                                        placeholder="Immatriculation"/>
                                  </FormGroup>
                                </Col>
                                <Col md={6}>
                                  <FormGroup row>
                                    <Label sm={12} for="profile">
                                      Photo de la CNI
                                    </Label>
                                    <Dropzone className="" onDrop={(acceptedFiles) => {
                                      setCNI(acceptedFiles.map(file => Object.assign(file, {
                                        preview: URL.createObjectURL(file)
                                      })));
                                    }} name="cni" multiple={false}>
                                      {({getRootProps, getInputProps}) => (
                                          <div {...getRootProps({className: 'wazi-dropzone2'})}>
                                            <input {...getInputProps()} />
                                            <span style={{ fontSize: ".8rem" }}>
                                                Recherchez ou Déposer une photo ici
                                           </span>
                                          </div>
                                      )}
                                    </Dropzone>
                                    {
                                      cni.length > 0 ?
                                          <Col sm={6} className="thumb-container pb-5">
                                            {
                                              cni.map(file => (
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
                                  <FormGroup row>
                                    <Label sm={12} for="profile">
                                      Document RCCM
                                    </Label>
                                    <Dropzone className="" onDrop={(acceptedFiles) => {
                                      setRCCM(acceptedFiles.map(file => Object.assign(file, {
                                        preview: URL.createObjectURL(file)
                                      })));
                                    }} name="rccm" multiple={false}>
                                      {({getRootProps, getInputProps}) => (
                                          <div {...getRootProps({className: 'wazi-dropzone2'})}>
                                            <input {...getInputProps()} />
                                            <span style={{ fontSize: ".8rem" }}>
                                                Recherchez ou Déposer une photo ici
                                           </span>
                                          </div>
                                      )}
                                    </Dropzone>
                                    {
                                      rccm.length > 0 ?
                                          <Col sm={6} className="thumb-container pb-5">
                                            {
                                              rccm.map(file => (
                                                  <>
                                                    <div className='' key={file.name}>
                                                      <div className=''>
                                                        <Row className="text-center">
                                                          <Col sm={6} className="text-center justify-content-center">
                                                            <img className="text-center justify-content-center"
                                                                 style={{ width: '115px', height: '115px' }}
                                                                 src={doc}
                                                                 alt={file.name}
                                                                 onLoad={() => { URL.revokeObjectURL(file.preview) }}
                                                            />
                                                          </Col>
                                                          <Col sm={6} className="text-center align-self-center align-items-center"><b className="text-center">{file.name}</b></Col>
                                                        </Row>


                                                      </div>
                                                    </div>
                                                  </>
                                              ))
                                            }
                                          </Col>
                                          :
                                          <></>
                                    }
                                  </FormGroup>
                                </Col>
                                <div className="divider mb-5"/>
                                <Col md={12}>
                                  <FormGroup row>
                                    <Label className="text-center" sm={12} for="username">
                                      <b>Photos du restaurant</b><br/>
                                      (Maximum 4 Images)
                                    </Label>
                                    <Col sm={12}>
                                      <Dropzone className="mt-2" onDrop={(acceptedFiles) => {
                                        setPicture(acceptedFiles.map(file => Object.assign(file, {
                                          preview: URL.createObjectURL(file)
                                        })));
                                      }} name="pictures" multiple={true} maxFiles={4}>
                                        {({getRootProps, getInputProps}) => (
                                            <div {...getRootProps({className: 'wazi-eats-dropzone justify-content-center'})}>
                                              <input {...getInputProps()} />
                                              <span className="" style={{ fontSize: ".8rem" }}>
                                                  Veuillez cliquer ici pour choisir vos images
                                              </span>
                                            </div>
                                        )}
                                      </Dropzone>
                                    </Col>
                                    <Col sm={9} className="thumbs-container pb-5 px-4" style={{ overflow: "auto" }}>
                                      {
                                        picture.map(file => (
                                            <div className='thumbs' key={file.name}>
                                              <div className='thumbs-inner'>
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
                                  </FormGroup>
                                </Col>

                              </Row>
                            </div>
                          </TabPanel>

                          <TabPanel>

                            <Row className="py-5">

                              <Col md={12} className="">
                                <FormGroup>
                                  <Label for="name">
                                    Nom(s) Administrateur restaurant *
                                  </Label>
                                  <Row>
                                    <Col>
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
                                            invalid={vname}/>
                                        <InputGroupText style={{ color: "#000", backgroundColor: "#eee", borderColor: "#eee" }}>
                                          <FontAwesomeIcon style={{ cursor : "pointer" }} icon={faUser} />
                                        </InputGroupText>
                                      </InputGroup>
                                      <FormFeedback className={ vname ? "d-block": ""}>
                                        Nom de l'administrateur du restaurant requis
                                      </FormFeedback>
                                    </Col>
                                    <Col>
                                      <InputGroup size="lg" className="mt-1">
                                        <Input
                                            type={"text"}
                                            name="sname"
                                            id="sname"
                                            value={sname}
                                            onChange={handleChange}
                                            style={{ backgroundColor: "#eee", borderColor: "#eee" }}
                                            bsSize="lg"
                                            placeholder="Prénoms"/>
                                        <InputGroupText style={{ color: "#000", backgroundColor: "#eee", borderColor: "#eee" }}>
                                          <FontAwesomeIcon style={{ cursor : "pointer" }} icon={faUserAlt} />
                                        </InputGroupText>
                                      </InputGroup>
                                    </Col>
                                  </Row>
                                </FormGroup>
                              </Col>

                              <Col className="my-5" md={12}>
                                <FormGroup className="position-relative">
                                  <Label for="phone">
                                    Téléphone Administrateur restaurant *
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
                                </FormGroup>
                              </Col>
                              <Col className="" md={6}>
                                <FormGroup className="position-relative">
                                  <Label for="email">
                                    Email Administrateur restaurant
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
                                        placeholder="Email de l'administrateur" />
                                    <InputGroupText style={{ color: "#000", backgroundColor: "#eee", borderColor: "#eee" }}>
                                      <FontAwesomeIcon style={{ cursor : "pointer" }} icon={faEnvelope} />
                                    </InputGroupText>
                                  </InputGroup>
                                </FormGroup>
                              </Col>

                              <Col md={6}>
                                <FormGroup row>
                                  <Label sm={12} for="profile">
                                    Photo de profil de l'administrateur
                                  </Label>
                                  <Dropzone className="" onDrop={(acceptedFiles) => {
                                    setImage(acceptedFiles.map(file => Object.assign(file, {
                                      preview: URL.createObjectURL(file)
                                    })));
                                  }} name="cni" multiple={false}>
                                    {({getRootProps, getInputProps}) => (
                                        <div {...getRootProps({className: 'wazi-dropzone2'})}>
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
                              {/*<Col md={6}>*/}
                              {/*  <FormGroup>*/}
                              {/*    <Label for="username">*/}
                              {/*      Mot de passe*/}
                              {/*    </Label>*/}
                              {/*    <Row className="">*/}
                              {/*      <Col sm={12}>*/}
                              {/*        <InputGroup size="lg" className="mt-3">*/}
                              {/*          <Input*/}
                              {/*              type={ show ? "text" : "password"}*/}
                              {/*              name="password"*/}
                              {/*              id="password"*/}
                              {/*              onChange={handleChange}*/}
                              {/*              value={password}*/}
                              {/*              style={{ backgroundColor: "#eee", borderColor: "#eee" }}*/}
                              {/*              bsSize="lg"*/}
                              {/*              placeholder="Mot de passe"/>*/}
                              {/*          <InputGroupText onClick={() => setShow(!show)} style={{ color: "#000", backgroundColor: "#eee", borderColor: "#eee" }}>*/}
                              {/*            { show ? <FontAwesomeIcon style={{ cursor : "pointer" }} icon={faEyeSlash} /> : <FontAwesomeIcon style={{ cursor : "pointer" }} icon={faEye} /> }*/}
                              {/*          </InputGroupText>*/}
                              {/*        </InputGroup>*/}
                              {/*      </Col>*/}
                              {/*      <Col sm={12}>*/}
                              {/*        <InputGroup size="lg" className="mt-4">*/}
                              {/*          <Input*/}
                              {/*              type={ view ? "text" : "password"}*/}
                              {/*              name="confirm"*/}
                              {/*              id="confirm"*/}
                              {/*              onChange={handleChange}*/}
                              {/*              value={confirm}*/}
                              {/*              style={{ backgroundColor: "#eee", borderColor: "#eee" }}*/}
                              {/*              bsSize="lg"*/}
                              {/*              placeholder="Confirmez le mot de passe"/>*/}
                              {/*          <InputGroupText onClick={() => setView(!view)} style={{ color: "#000", backgroundColor: "#eee", borderColor: "#eee" }}>*/}
                              {/*            { view ? <FontAwesomeIcon style={{ cursor : "pointer" }} icon={faEyeSlash} /> : <FontAwesomeIcon style={{ cursor : "pointer" }} icon={faEye} /> }*/}
                              {/*          </InputGroupText>*/}
                              {/*        </InputGroup>*/}
                              {/*      </Col>*/}
                              {/*      <FormFeedback className={ passError ? "d-block": ""}>*/}
                              {/*        Mot de passe invalide*/}
                              {/*      </FormFeedback>*/}
                              {/*    </Row>*/}
                              {/*  </FormGroup>*/}
                              {/*</Col>*/}

                            </Row>

                          </TabPanel>

                          <TabPanel>
                            <Row className="py-5">
                              <Col md={12}>
                                <FormGroup>
                                  <Label for="username">
                                    Site Web
                                  </Label>
                                  <InputGroup size="md" className="mt-1 mb-3">
                                    <Input
                                        type={ "text"}
                                        name="website"
                                        id="website"
                                        onChange={handleChange}
                                        value={web}
                                        style={{ backgroundColor: "#eee", borderColor: "#eee" }}
                                        bsSize="lg"
                                        placeholder="Site Web"
                                    />
                                    <InputGroupText style={{ color: "#000", backgroundColor: "#eee", borderColor: "#eee" }}>
                                      <FontAwesomeIcon style={{ cursor : "pointer" }} icon={faGlobeAfrica} />
                                    </InputGroupText>
                                  </InputGroup>
                                  <FormText>
                                    Exemple: <i>https://www.example.com</i>
                                  </FormText>
                                </FormGroup>
                              </Col>
                              <Col md={12}>
                                <FormGroup className="mt-5">
                                  <Label for="username">
                                    Autres liens (Facebook, Instagram, WhatsApp etc.)
                                  </Label>
                                  <CreatableSelect
                                      components={components}
                                      inputValue={social}
                                      onChange={(newValue) => setValue(newValue)}
                                      onInputChange={(newValue) => setSocial(newValue)}
                                      onKeyDown={handleKeyDown}
                                      value={value}
                                      className="mb-3" menuIsOpen={false}
                                      placeholder="Entrez les liens"
                                      style={{ backgroundColor: "#eee", borderColor: "#eee" }}
                                      isMulti isClearable />
                                  <FormText>
                                    Entrez le lien et appuyez <b>ENTREE</b> pour valider
                                  </FormText>
                                </FormGroup>
                              </Col>
                            </Row>
                          </TabPanel>

                        </TabPanels>
                      </Tabs>

                      <div style={{ height: "15%" }}>
                        <div className="divider"/>

                        <Row className="px-3 mb-4">
                          <Col>
                            {
                              tabIndex > 0 ?
                                  <Button onClick={()=>prevTab()} type="button" size="md" className="fw-bold btn btn-login-alt mt-2" block>
                                    <FontAwesomeIcon icon={faArrowLeft} /> &nbsp; Précédent
                                  </Button> : <></>
                            }
                          </Col>
                          <Col>
                            {
                              tabIndex === 3 ?
                                  <Button type="button" onClick={handleSubmit} size="md" className="fw-bold btn btn-login mt-2" block>
                                    Créer
                                  </Button>
                                  :
                                  <Button onClick={()=>nextTab()} type="button" size="md" className="fw-bold btn btn-login-alt mt-2" block>
                                    Suivant &nbsp; <FontAwesomeIcon icon={faArrowRight} />
                                  </Button>
                            }
                          </Col>
                        </Row>

                        <div className="divider"/>
                      </div>

                    </Col>

                    <Col lg={12} style={{ height: '5%'}}>

                      <div className="fw-bold text-dark text-center mt-2">
                        J'ai déjà un compte. Se&nbsp;<a href="/login" className="wazieats-2-link">connecter</a>&nbsp;à son compte.
                      </div>

                    </Col>

                  </Row>

                </Form>

              </LoadingOverlay>
            </Col>

          </Row>
        </div>
      </Fragment>
  );
}
