import React, {useContext, useEffect, useState} from 'react';
import { Redirect } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {
  Button,
  Card,
  CardHeader,
  Col,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Input,
  Row,
  UncontrolledButtonDropdown, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, FormText
} from "reactstrap";
import Base from '../Base';
import Item from '../../components/Item';
import {isLoggedIn, selectDrinks, selectMenu, selectPlates} from '../../utils/selectors';
import defaultFoodImage from "../../assets/utils/images/food/food_1.jpg";
import defaultFoodDrink from "../../assets/utils/images/drink/drink_3.jpg";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fetchMenu, removeItem} from "../../features/menu";
import swal from "sweetalert";
import drinkService from "../../services/drinkService";
import menuService from "../../services/menuService";
import {Loader} from "react-loaders";
import LoadingOverlay from "react-loading-overlay-ts";
import {Spinner} from "@chakra-ui/react";
import noImg from "../../assets/img.png";
import img from "../../assets/wazi.png";
import AsyncCreatableSelect from "react-select/async-creatable/dist/react-select.esm";
import {faTimes, faHotdog, faArrowLeft, faArrowRight} from "@fortawesome/free-solid-svg-icons";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import foodService from "../../services/foodService";
import Slider from "react-slick";
import {fetchPlates} from "../../features/plates";
import PlateContext from "../../context/selectPlates";

function Menu() {

  const dispatch = useDispatch()
  const { loading, error, data } = useSelector(selectMenu)

  useEffect(() => {
    dispatch(fetchMenu())
  }, [dispatch])

  const [ filter, setFilter ] = useState('')
  const [ modal, setModal ] = useState(false)
  const isConnected = useSelector(isLoggedIn)
  const [ message, setMessage ] = useState('')
  const [ itemToDelete, setItemToDelete ] = useState(null)
  const [ foodType, setFoodType ] = useState([])
  const [ foodData, setFoodData ] = useState([])
  const [ selectedFood, setSelectedFood ] = useState([])
  const [ drinkType, setDrinkType ] = useState([])
  const [ drinkData, setDrinkData ] = useState([])
  const [ selectedDrink, setSelectedDrink ] = useState([])

  const [ load, setLoad ] = useState(false)

  if (!isConnected) {
    return <Redirect to='/login'/>
  }

  const toggleConfirmDelete = (d) => {
    swal({
      text: "Confirmer la suppréssion du menu",
      title: "Suppréssion",
      icon: "warning",
      buttons: ["Non", "Oui"],
    }).then((value) => {
      if(value){
        menuService.remove(d.id).then(()=>{
          dispatch(removeItem(d))
          setMessage('Menu supprimée avec succès.')
          setItemToDelete(d)
          swal("Menu supprimée avec succès", {
            icon: 'success'
          })
        }).catch(err => {
          swal("Erreur lors du traitement de la requete", {
            icon: 'error'
          })
        })
      }
    });
  }

  const toggle = () => {
    resetForm()
    setModal(!modal);
  }

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  const handleDelete = (drink) => {
    toggleConfirmDelete(drink)
  }

  useEffect(() => {
    foodService.getFoodType()
        .then((response) => {
          setFoodType(response.data)
        })
        .catch((error) => {
          console.log(error)
        })
    foodService.getAll()
        .then((response) => {
          setFoodData(response.data)
        })
        .catch((error) => {
          console.log(error)
        })
    drinkService.getDrinkType()
        .then((response) => {
          setDrinkType(response.data)
        })
        .catch((error) => {
          console.log(error)
        })
    drinkService.getAll()
        .then((response) => {
          setDrinkData(response.data)
        })
        .catch((error) => {
          console.log(error)
        })
  }, [])

  const [ id, setId ] = useState(0)
  const filters = ['Nom', 'Prix', 'Catégorie']

  const [ loader, setLoader ] = useState(false)

  const closeBtn = (
      <FontAwesomeIcon className="close" onClick={toggle} style={{ cursor : "pointer", fontSize: "1.5rem" }} icon={faTimes} />
  );

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

  const [ fname, setFName ] = useState('')
  const [ vfName, setVFname ] = useState(false)
  const [ dname, setDName ] = useState('')
  const [ vdName, setVDname ] = useState(false)
  const [ name, setName ] = useState('')
  const [ vName, setVname ] = useState(false)
  const [ description, setDescription ] = useState('')
  const [ price, setPrice ] = useState(0)
  const [ percent, setPercent ] = useState(0)
  const [ status, setStatus ] = useState()
  const [ vStatus, setVstatus ] = useState(false)
  const [ vPrice, setVprice ] = useState(false)
  const [ sDate, setStartDate ] = useState('')
  const [ vDate, setVdate ] = useState('')
  const [ eDate, setEndDate ] = useState('')
  const [ day, setDay ] = useState('')
  const [ vDay, setVday ] = useState(false)
  const [ repeat, setRepeat ] = useState(false)

  const resetForm = () => {
    setId(0)
    setTabIndex(0)
    setFName('')
    setDName('')
    setName('')
    setPercent(0)
    setStatus()
    setDescription('')
    setStartDate('')
    setEndDate('')
    setDay('')
    setPrice(0)
    setLoad(false)
    setLoader(false)
    setRepeat(false)
    setVFname(false)
    setVDname(false)
    setVname(false)
    setVdate(false)
    setVday(false)
    setVprice(false)
    setSelectedDrink([])
    setSelectedFood([])
  }

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    switch(name) {
      case 'fname': {
        setFName(value)
        setLoad(true)
        if(value.length === 0){
          foodService.getAll()
              .then((response) => {
                setLoad(false)
                setFoodData(response.data)
                response.data.forEach(element => {
                  const index = selectedFood.findIndex(item => item.id === element.id)
                  const elem = document.querySelector(`#sFood${element.id}`)
                  if(index === -1){
                    elem.checked = false
                  }
                  else{
                    elem.checked = true
                  }
                });
              })
              .catch((error) => {
                setLoad(false)
                setFoodData([])
              })
        }
        else{
          foodService.getFoodByType(fType, value)
              .then((response) => {
                setLoad(false)
                setFoodData(response.data)
                response.data.forEach(element => {
                  const index = selectedFood.findIndex(item => item.id === element.id)
                  const elem = document.querySelector(`#sFood${element.id}`)
                  if(index === -1){
                    elem.checked = false
                  }
                  else{
                    elem.checked = true
                  }
                });
              })
              .catch((error) => {
                setLoad(false)
                setFoodData([])
              })
        }
      }; break;
      case 'dname': {
        setDName(value)
        setLoad(true)
        if(value.length === 0){
          drinkService.getAll()
              .then((response) => {
                setLoad(false)
                setDrinkData(response.data)
                response.data.forEach(element => {
                  const index = selectedDrink.findIndex(item => item.id === element.id)
                  const elem = document.querySelector(`#sDrink${element.id}`)
                  if(index === -1){
                    elem.checked = false
                  }
                  else{
                    elem.checked = true
                  }
                });
              })
              .catch((error) => {
                setLoad(false)
                setDrinkData([])
              })
        }
        else{
          drinkService.getDrinkByType(dType, value)
              .then((response) => {
                setLoad(false)
                setDrinkData(response.data)
                response.data.forEach(element => {
                  const index = selectedDrink.findIndex(item => item.id === element.id)
                  const elem = document.querySelector(`#sDrink${element.id}`)
                  if(index === -1){
                    elem.checked = false
                  }
                  else{
                    elem.checked = true
                  }
                });
              })
              .catch((error) => {
                setLoad(false)
                setDrinkData([])
              })
        }
      }; break;
      case 'name': setName(value); break;
      case 'end': setEndDate(value); break;
      case 'start': setStartDate(value); break;
      case 'day': setDay(value); break;
      case 'repeat': setRepeat(value); break;
      case 'percent': setPercent(value); break;
      case 'status': setStatus(value); break;
      case 'description': setDescription(value); break;
      case 'price': setPrice(value); break;
      default: break;
    }
  }

  let classes = [
      "btn-login", "btn-login2", "btn-login-alt", "btn-login-alt2"
  ]

  function getRandomItem(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    const item = arr[randomIndex];
    return item;
  }

  const fetchFoodType = (ft) => {
    setFType(ft)
    setLoad(true)
    foodService.getFoodByType(ft, fname)
        .then((response) => {
          setLoad(false)
          setFoodData(response.data)
          response.data.forEach(element => {
            const index = selectedFood.findIndex(item => item.id === element.id)
            const elem = document.querySelector(`#sFood${element.id}`)
            if(index === -1){
              elem.checked = false
            }
            else{
              elem.checked = true
            }
          });
        })
        .catch((error) => {
          setLoad(false)
          setFoodData([])
        })
  }

  const fetchDrinkType = (dt) => {
    setDType(dt)
    setLoad(true)
    drinkService.getDrinkByType(dt, dname)
        .then((response) => {
          setLoad(false)
          setDrinkData(response.data)
          response.data.forEach(element => {
            const index = selectedDrink.findIndex(item => item.id === element.id)
            const elem = document.querySelector(`#sDrink${element.id}`)
            if(index === -1){
              elem.checked = false
            }
            else{
              elem.checked = true
            }
          });
        })
        .catch((error) => {
          setLoad(false)
          setDrinkData([])
        })
  }

  const clearFoodFilter = () => {
    setFType("")
    setLoad(true)
    foodService.getAll()
        .then((response) => {
          setLoad(false)
          setFoodData(response.data)
          foodData.forEach(element => {
            const index = selectedFood.findIndex(item => item.id === element.id)
            const elem = document.querySelector(`#sFood${element.id}`)
            if(index === -1){
              elem.checked = false
            }
            else{
              elem.checked = true
            }
          });
        })
        .catch((error) => {
          setLoad(false)
          console.log(error)
        })
  }

  const clearDrinkFilter = () => {
    setDType("")
    setLoad(true)
    drinkService.getAll()
        .then((response) => {
          setLoad(false)
          setDrinkData(response.data)
          drinkData.forEach(element => {
            const index = selectedDrink.findIndex(item => item.id === element.id)
            const elem = document.querySelector(`#sDrink${element.id}`)
            if(index === -1){
              elem.checked = false
            }
            else{
              elem.checked = true
            }
          });
        })
        .catch((error) => {
          setLoad(false)
          console.log(error)
        })
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  }

  const handleSelectedFood = (ev, it) => {
    let arr = selectedFood
    const index = arr.findIndex(item => item.id === it.id)
    const elem = document.querySelector(`#sFood${it.id}`)
    if(index === -1){
      arr.push(it)
      elem.checked = true
    }
    else{
      arr.splice(index, 1)
      elem.checked = false
    }
    setSelectedFood(selectedFood)
  }

  const handleSelectedDrink = (ev, it) => {
    let arr = selectedDrink
    const index = arr.findIndex(item => item.id === it.id)
    const elem = document.querySelector(`#sDrink${it.id}`)
    if(index === -1){
      arr.push(it)
      elem.checked = true
    }
    else{
      arr.splice(index, 1)
      elem.checked = false
    }
    setSelectedDrink(selectedDrink)
  }

  const edit = (menu) => {
    setTabIndex(0)
    setId(menu.id)
    // setName(menu.name)
    // setPrice(menu.price)
    // setCategory(menu.foodCategory.id)
    // setDescription(menu.description)
    // setType(menu.foodType.id)
    // setNutritional(menu.nutritional_value)
    // setTimer(toSecond(menu.cooking_time))
    // const ingredients = []
    // for(var i = 0; i < plate.ingredients.length; i++){
    //   ingredients.push(plate.ingredients[i])
    // }
    // setIngredient(ingredients)
    // setFiles([]);
    // setImage(plate.foodPicture)
    setModal(true)
  }

  function isSelect(id, table){
    return table.includes(id)
  }

  const toggleConfirm = () => {

    const d = new Date();

    console.log(d.getTime())

    const title = (id === 0) ? "Confirmer l'ajout de la menu" : "Confirmer la mise à jour de la menu";
    const buttonText = (id === 0) ? "Ajouter" : "Mettre à jour";
    const successText = (id === 0) ? "Menu ajoutée avec succès" : "Menu mise à jour avec succès"

    swal({
      text: title,
      title: "Confirmation",
      icon: "info",
      buttons: ["Annuler", buttonText],
      dangerMode: true
    }).then((isConfirm) => {
      if(isConfirm){
        setLoader(true)
        if(id === 0) {
          setLoader(true)
          const formData = new FormData()
          formData.append('name', "Menu Period " + day + " " + d.getTime())
          formData.append('description', "Period du jour : " + day)
          formData.append("start_date", sDate)
          formData.append("end_date", eDate)
          formData.append("menu_day", day)
          formData.append("repeat", repeat)
          menuService.createPeriod(formData).then((response) => {
            const fData = new FormData()
            fData.append('name', name)
            fData.append('description', "Menu du jour : " + day)
            fData.append("status_price", status)
            fData.append("percent", percent)
            fData.append("period", response.data.id)
            selectedDrink.forEach(element => {
              fData.append("drinks", element.id)
            });
            selectedFood.forEach(element => {
              fData.append("foods", element.id)
            });
            menuService.create(fData).then((response) => {
              setLoader(false)
              dispatch(fetchMenu())
              resetForm()
              toggle()
              swal(successText, {
                icon: 'success'
              })
            }).catch((error) => {
              setLoader(false)
              if(error.response.data.message.includes("status_price")){
                swal("Erreur", "Le statut du prix est invalide", "error");
              }
              else if(error.response.data.message.includes("period")){
                swal("Erreur", "La periode de publication est invalide", "error");
              }
              else if(error.response.data.message.includes("name")){
                swal("Erreur", "Le nom du menu est invalide", "error");
              }
              else if(error.response.data.message.includes("foods")){
                swal("Erreur", "Aucun plat selectionné", "error");
              }
              else if(error.response.data.message.includes("drinks")){
                swal("Erreur", "Aucune boisson selectionné", "error");
              }
              else if(error.response.status === 409){
                swal("Erreur", error.response.data.message, "error");
              }
              else if (error) {
                swal("Erreur", error.message, "error");
              } else {
                swal.stopLoading();
                swal.close();
              }
            })
          })
        }
        else {

        }
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault()

    validate()

    if(name === ''){
      setVname(true)
    }
    if(price <= 0 || isNaN(price)){
      setVprice(true)
    }
    if(day === ''){
      setVday(true)
    }
    if(sDate === ''){
      setVdate(true)
    }
    if(status === ''){
      setVstatus(true)
    }
    if(status !== '' && name !== '' && price > 0 && !isNaN(price) && day !== '' && sDate !== '')
    {
      validate()
      toggleConfirm()
    }
  }

  function validate(){
      setVname(false)
      setVprice(false)
      setVday(false)
      setVdate(false)
      setVstatus(false)
  }

  const [ dType, setDType ] = useState("")
  const [ fType, setFType ] = useState("")

  return (
    <Base>
      <div className="app-inner-layout">

        <div className="app-inner-layout__header-boxed p-0">
          <div className="app-inner-layout__header text-dark bg-white mb-4 d-flex justify-content-between align-content-center">
            <div>
              <Input 
                value={filter} 
                onChange={handleFilter}
                type="select" 
                name="filter" 
                id="filter" >
                  <option value="">Afficher par</option>
                  {filters.map((filter, index) => (
                    <option key={`filter-${index}`} value={filter}>
                      {filter}
                    </option>
                  ))}
              </Input>
            </div>
            <h1 className='fs-3'>Gestion des menus</h1>
            <div>
              <Button className='btn-icon btn-icon-only pt-0 ps-2 wazi-btn-add float-end wazi-btn' onClick={toggle}>
                <FontAwesomeIcon icon="plus" />
              </Button>
            </div>
          </div>
        </div>

        <Row>

          <Col md="12">
            <Modal id="modal" className='wazi-modal' isOpen={modal} toggle={toggle} size="xl" backdrop="static">
              <ModalHeader style={{ fontSize: "1.5rem" }} toggle={toggle} close={closeBtn}>
                <FontAwesomeIcon icon="utensils" /><FontAwesomeIcon icon="wine-bottle" />
                &nbsp;&nbsp;{ id === 0 ? "Ajouter un menu" : "Mise à jour d'un menu"}
              </ModalHeader>
              <ModalBody>

                {
                  loader ?
                      <div className="text-center py-5">
                        <div className="text-center py-5">
                          <div className="text-center py-5">
                            <Spinner
                                thickness='4px'
                                emptyColor='gray.200'
                                color='green.500'
                                size='xl' />
                          </div>
                        </div>
                      </div>
                      :
                      <Form>

                        <Tabs isFitted variant='soft-rounded' colorScheme='green' index={tabIndex} onChange={handleTabsChange}>
                          
                          <TabList className='my-3 px-5'>
                            <div className="px-5 d-flex justify-content-center w-100">
                              <Tab>
                                Plats
                              </Tab>
                              <Tab>
                                Boissons
                              </Tab>
                              <Tab>
                                Détails
                              </Tab>
                            </div>
                          </TabList>

                          <TabPanels>

                            <TabPanel className="pt-5 px-5">

                              <FormGroup>
                                <Input
                                    value={id}
                                    type="hidden"
                                    name="id"
                                    id="id" />
                              </FormGroup>

                              <FormGroup row>
                                <Label for="name" sm={2}>
                                  Nom *
                                </Label>
                                <Col sm={10}>
                                  <Input
                                      value={fname}
                                      invalid={vfName}
                                      onChange={handleChange}
                                      type="text"
                                      name="fname"
                                      id="fname"
                                      placeholder="Entrer le nom"/>
                                </Col>
                              </FormGroup>

                              <FormGroup className="mt-3 mb-3" row>
                                <Label for="name" sm={2}>
                                  Tags
                                </Label>
                                <Col sm={10}>
                                  <Button type="button" onClick={()=>clearFoodFilter()} size="sm" className={"fw-bold me-1 mt-2 btn btn-login"}>
                                    Tous les plats
                                  </Button>
                                  {
                                    foodType.map((ft, i) => {
                                      return <Button type="button" onClick={()=>fetchFoodType(ft.name)} size="sm" className={"fw-bold me-1 mt-2 btn " + getRandomItem(classes) + ""}>
                                        {ft.name}
                                      </Button>
                                    })
                                  }
                                </Col>
                              </FormGroup>

                              <FormGroup className="" row>
                                <Label for="name" sm={2}>
                                  Sélectionnés
                                </Label>
                                <Col className="mt-4" sm={10}>
                                  {
                                    load ?
                                        <div className="text-center">
                                          <div className="text-center py-5">
                                            <div className="text-center py-5">
                                              <Spinner
                                                  thickness='4px'
                                                  emptyColor='gray.200'
                                                  color='green.500'
                                                  size='xl' />
                                            </div>
                                          </div>
                                        </div>
                                        :
                                        <>
                                          {
                                            foodData.length > 0 ?
                                                <>
                                                  <Slider {...settings}>
                                                    {foodData.map((item) => (
                                                        <div key={`plate-${item.id}`} className="px-2">
                                                          <Card className="wazi-card-item card-shadow-primary card-border text-white mb-3">
                                                            <div className="btn-actions-pane-right actions-icon-btn">
                                                              <FormGroup check>
                                                                <Label check>
                                                                  <Input
                                                                  defaultChecked={isSelect(item.id, selectedFood)}
                                                                  type="checkbox" 
                                                                  id={`sFood${item.id}`}
                                                                  onChange={(e)=>handleSelectedFood(e, item)} />
                                                                </Label>
                                                              </FormGroup>
                                                            </div>
                                                            <Item name={item.name} price={item.price} image={item.foodPicture} />
                                                          </Card>
                                                        </div>
                                                    ))}
                                                  </Slider>
                                                </>
                                                :
                                                <div className="p-5 text-center">
                                                  <FontAwesomeIcon icon="utensils" style={{ }} /><br/>
                                                  Aucun plat disponible
                                                </div>
                                          }
                                        </>
                                  }

                                </Col>
                              </FormGroup>

                            </TabPanel>

                            <TabPanel className="pt-5 px-5">

                              <FormGroup row>
                                <Label for="name" sm={2}>
                                  Nom *
                                </Label>
                                <Col sm={10}>
                                  <Input
                                      value={dname}
                                      invalid={vdName}
                                      onChange={handleChange}
                                      type="text"
                                      name="dname"
                                      id="dname"
                                      placeholder="Entrer le nom"/>
                                </Col>
                              </FormGroup>

                              <FormGroup className="mt-3 mb-3" row>
                                <Label for="name" sm={2}>
                                  Tags
                                </Label>
                                <Col sm={10}>
                                  <Button type="button" onClick={()=>clearDrinkFilter()} size="sm" className={"fw-bold me-1 mt-2 btn btn-login"}>
                                    Tous les boissons
                                  </Button>
                                  {
                                    drinkType.map((dt, i) => {
                                      return <Button type="button" onClick={()=>fetchDrinkType(dt.name)} size="sm" className={"fw-bold me-1 mt-2 btn " + getRandomItem(classes) + ""}>
                                        {dt.name}
                                      </Button>
                                    })
                                  }
                                </Col>
                              </FormGroup>

                              <FormGroup className="" row>
                                <Label for="name" sm={2}>
                                  Sélectionnés
                                </Label>
                                <Col className="mt-4" sm={10}>
                                  {
                                    load ?
                                        <div className="text-center">
                                          <div className="text-center py-5">
                                            <div className="text-center py-5">
                                              <Spinner
                                                  thickness='4px'
                                                  emptyColor='gray.200'
                                                  color='green.500'
                                                  size='xl' />
                                            </div>
                                          </div>
                                        </div>
                                        :
                                        <>
                                          {
                                            drinkData.length > 0 ?
                                                <>
                                                  <Slider {...settings}>
                                                    {drinkData.map((item) => (
                                                        <div key={`plate-${item.id}`} className="px-2">
                                                          <Card className="wazi-card-item card-shadow-primary card-border text-white mb-3">
                                                            <div className="btn-actions-pane-right actions-icon-btn">
                                                              <FormGroup check>
                                                                <Label check>
                                                                  <Input type="checkbox" 
                                                                  id={`sDrink${item.id}`}
                                                                  onChange={(e)=>handleSelectedDrink(e, item)} />
                                                                </Label>
                                                              </FormGroup>
                                                            </div>
                                                            <Item name={item.name} price={item.price} image={item.drinkPicture} />
                                                          </Card>
                                                        </div>
                                                    ))}
                                                  </Slider>
                                                </>
                                                :
                                                <div className="p-5 text-center">
                                                  <FontAwesomeIcon icon="wine-bottle" style={{ }} /><br/>
                                                  Aucune boisson disponible
                                                </div>
                                          }
                                        </>
                                  }
                                </Col>
                              </FormGroup>

                            </TabPanel>

                            <TabPanel className="pt-5 px-5">

                              <FormGroup row>
                                <Label sm={2}>
                                  Composition
                                </Label>
                                <Col sm={10}>
                                  {
                                    selectedFood.length === 0 && selectedDrink.length === 0 ?
                                        <div className={"pt-2"}><b className="text-danger">Aucun plat ou boisson sélectionné</b></div> :
                                        <Slider {...settings}>
                                          {selectedFood.map((item) => (
                                              <div key={`food-${item.id}`} className="px-2 mb-4">
                                                <div className="wazi-card-item card-shadow-primary card-border text-center px-3 py-2">
                                                  <FontAwesomeIcon icon="utensils" /> &nbsp; {item.name}
                                                </div>
                                              </div>
                                          ))}
                                          {selectedDrink.map((item) => (
                                              <div key={`drink-${item.id}`} className="px-2 mb-4">
                                                <div className="wazi-card-item card-shadow-primary card-border text-center px-3 py-2">
                                                  <FontAwesomeIcon icon="wine-bottle" /> &nbsp; {item.name}
                                                </div>
                                              </div>
                                          ))}
                                        </Slider>
                                  }
                                </Col>
                              </FormGroup>

                              <FormGroup className="mt-3 mb-3" row>
                                <Label for="name" sm={2}>
                                  Nom *
                                </Label>
                                <Col sm={10}>
                                  <Input
                                      value={name}
                                      invalid={vName}
                                      onChange={handleChange}
                                      type="text"
                                      name="name"
                                      id="name"
                                      placeholder="Entrer le nom"/>
                                </Col>
                              </FormGroup>

                              <FormGroup row>
                                <Label for="description" sm={2}>
                                  Description *
                                </Label>
                                <Col sm={10}>
                                  <Input
                                      value={description}
                                      onChange={handleChange}
                                      type="textarea"
                                      maxLength={50}
                                      name="description"
                                      id="description"
                                      placeholder="Maximum 50 caractères"/>
                                </Col>
                              </FormGroup>

                              <FormGroup row>
                                <Label sm={2}>
                                  Prix calculé *
                                </Label>
                                <Col sm={10}>
                                  <Input
                                      value={price}
                                      invalid={vPrice}
                                      onChange={handleChange}
                                      type="number"
                                      name="price"
                                      id="price"
                                      placeholder="0.000 FCFA"/>
                                </Col>
                              </FormGroup>

                              <FormGroup row>
                                <Label sm={2}>
                                  Pourcentage<br/>
                                    <span className={"text-muted"} style={{ fontSize: "12px" }}>(Hausse ou rabais en %)</span>
                                </Label>
                                <Col sm={6}>
                                  <Input
                                      value={percent}
                                      onChange={handleChange}
                                      type="number"
                                      name="percent"
                                      id="percent"
                                      placeholder="0.0 %"/>
                                </Col>
                                <Col sm={4}>
                                  <Input
                                      value={status}
                                      onChange={handleChange}
                                      type="select"
                                      invalid={vStatus}
                                      name="status"
                                      // style={{ backgroundColor: '#0ab44e', color: '#fff' }}
                                      id="status" >
                                    <option value="">Choisir le prix final</option>
                                    <option value="1">Prix Soldé</option>
                                    <option value="2">Prix Réel</option>
                                  </Input>
                                </Col>
                              </FormGroup>

                              <FormGroup row>
                                <Label sm={2}>
                                  Jour de publication
                                </Label>
                                <Col sm={2}>
                                  <Input
                                      value={day}
                                      invalid={vDay}
                                      onChange={handleChange}
                                      type="select"
                                      name="day"
                                      style={{ backgroundColor: '#0ab44e', color: '#fff' }}
                                      id="day" >
                                    <option value="">Jour</option>
                                    <option value="1">Lundi</option>
                                    <option value="2">Mardi</option>
                                    <option value="3">Mercredi</option>
                                    <option value="4">Jeudi</option>
                                    <option value="5">Vendredi</option>
                                    <option value="6">Samedi</option>
                                    <option value="7">Dimanche</option>
                                  </Input>
                                </Col>
                                <Col sm={3}>
                                  <Input
                                      value={sDate}
                                      invalid={vDate}
                                      onChange={handleChange}
                                      type="date"
                                      name="start"
                                      id="start"
                                      placeholder="Début"/>
                                      <span>Date de debut</span>
                                </Col>
                                <Col sm={3}>
                                  <Input
                                      value={eDate}
                                      onChange={handleChange}
                                      type="date"
                                      name="end"
                                      id="end"
                                      placeholder="Fin"/>
                                      <span>Date de fin</span>
                                </Col>
                                <Col sm={2}>
                                  <Input
                                      value={repeat}
                                      onChange={handleChange}
                                      type="select"
                                      name="day"
                                      style={{ backgroundColor: '#0ab44e', color: '#fff' }}
                                      id="day" >
                                    <option value="">Répéter</option>
                                    <option value="1">Oui</option>
                                    <option value="0">Non</option>
                                  </Input>
                                </Col>
                              </FormGroup>

                            </TabPanel>

                          </TabPanels>
                        </Tabs>

                        <Row className='mt-5'>
                          <Col sm={{ size: 3, offset: 6 }}>
                            {
                              tabIndex > 0 ?
                                  <Button onClick={()=>prevTab()} type="button" size="sm" className="fw-bold btn btn-login mt-2" block>
                                    <FontAwesomeIcon icon={faArrowLeft} /> &nbsp; Précédent
                                  </Button> : <></>
                            }
                          </Col>
                          <Col sm={{ size: 3 }}>
                            {
                              tabIndex === 2 ?
                                  <Button onClick={(e)=>handleSubmit(e)} type="button" size="sm" className="fw-bold btn btn-login mt-2" block>
                                    Terminer
                                  </Button>
                                  :
                                  <Button onClick={()=>nextTab()} type="button" size="sm" className="fw-bold btn btn-login mt-2" block>
                                    Suivant &nbsp; <FontAwesomeIcon icon={faArrowRight} />
                                  </Button>
                            }
                          </Col>
                        </Row>

                      </Form>
                }

              </ModalBody>
            </Modal>
          </Col>

        </Row>

        <LoadingOverlay tag="div" active={loading} styles={{
                          overlay: (base) => ({
                            ...base,
                            background: "#fff",
                            opacity: 0.5,
                          }),
                        }} spinner={<Loader active={loading} type='ball-pulse-rise' />}>

          <Row>
          {data.map((item, index) => (
              <Col md="12" lg="6" xl="3">
                <Card className="wazi-card-item card-shadow-primary card-border text-white mb-3">
                <CardHeader>
                <div className="btn-actions-pane-right actions-icon-btn">
                  <UncontrolledButtonDropdown>
                    <DropdownToggle className="btn-icon btn-icon-only" color="link">
                      <FontAwesomeIcon icon="ellipsis-v" className='btn-icon-wrapper' />
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-shadow dropdown-menu-hover-link">
                      <DropdownItem onClick={e => edit(item)}>
                        <i className="dropdown-icon lnr-pencil"> </i>
                        <span>Modifier</span>
                      </DropdownItem>
                      <DropdownItem onClick={e => handleDelete(item)}>
                        <i className="dropdown-icon lnr-trash"> </i>
                        <span>Suppprimer</span>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledButtonDropdown>
                </div>
                </CardHeader>
                <Item name={item.name} price={item.real_price} image={img} />
                  <div className='item-detail'>
                    <h5 style={{ position: "absolute", bottom: "30px", left: "35%" }}>Détails de la boisson</h5>
                  </div>
              </Card>
              </Col>
            ))}
          </Row>

        </LoadingOverlay>

      </div>
    </Base>
  )
}

export default Menu