import { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import Select from 'react-select';
import { Redirect } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faUtensils, faPlus, faBars, faEllipsisV, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Loader } from "react-loaders";
import LoadingOverlay from "react-loading-overlay-ts";
import {
  Button,
  Card,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  UncontrolledDropdown,
  InputGroup, InputGroupText,
  DropdownItem,
} from "reactstrap";
import { Multiselect } from "react-widgets";
import Base from '../Base';
import Item from '../../components/Item';
import { selectPlates } from '../../utils/selectors';
import { isLoggedIn } from '../../utils/selectors';
import { addItem, fetchPlates, updateItem, removeItem } from '../../features/plates';
import foodService from '../../services/foodService';
import logo from '../../assets/logo.png'
import {
  Tag, HStack,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  TagCloseButton,
  Avatar,
  Wrap,
  SimpleGrid,
  Checkbox,
} from '@chakra-ui/react'
import swal from "sweetalert";
import { Spinner } from '@chakra-ui/react'

library.add(
  fab,
  faUtensils,
  faPlus,
  faBars,
  faEllipsisV
);

function Plates() {
  
  const dispatch = useDispatch()
  const { loading, error, data } = useSelector(selectPlates)
  
  const isConnected = useSelector(isLoggedIn)
  
  const [ id, setId ] = useState(0)
  const [ name, setName ] = useState('')
  const [ category, setCategory ] = useState(null)
  const [ type, setType ] = useState(null)
  const [ price, setPrice ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ nutritional, setNutritional ] = useState('')
  const [ timer, setTimer ] = useState('')
  const [ ingredient, setIngredient ] = useState([])
  const [ categories, setCategories ] = useState([])
  const [ types, setTypes ] = useState([])
  const [ ingredients, setIngredients ] = useState([])

  const [ vName, setVname ] = useState(false)
  const [ vPrice, setVprice ] = useState(false)
  const [ vType, setVtype ] = useState(false)
  const [ vCategory, setVcategory ] = useState(false)

  const [ dType, setDtype ] = useState(false)
  const [ dCategory, setDcategory ] = useState(false)
  const [ dDesc, setDdesc ] = useState(false)
  const [ image, setImage ] = useState(false)

  const [ loader, setLoader ] = useState(false)

  //const [ filter, setFilter ] = useState('')
  const [ modal, setModal ] = useState(false)
  const [ confirmModal, setConfirmModal ] = useState(false)
  const [ confirmDelete, setConfirmDelete ] = useState(false)
  const [ message, setMessage ] = useState('')
  const [ show, setShow ] = useState(false)
  const [ itemToDelete, setItemToDelete ] = useState(null)

  const [files, setFiles] = useState([]);

  const {
    getRootProps,
    getInputProps
  } = useDropzone({
    // multiple: false,
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
      setImage("")
    },
    
  });

  const thumbs = files.map(file => (
    <div className='thumbs' key={file.name}>
      <div className='thumbs-inner'>
        <img
          src={file.preview}
          alt={file.name}
          // Revoke data uri after image is loaded
          onLoad={() => { URL.revokeObjectURL(file.preview) }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  useEffect(() => {
    dispatch(fetchPlates())
  }, [dispatch])

  useEffect(() => {
    foodService.getFoodCategory()
      .then((response) => {
        setCategories(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
    
    foodService.getFoodType()
      .then((response) => {
        setTypes(response.data)
      })
      .catch((error) => {
        console.log(error)
      })

    foodService.getIngredients()
      .then((response) => {
        setIngredients(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  if (!isConnected) {
    return <Redirect to='/login'/>
  }

  const toggle = () => {
    resetForm()
    setModal(!modal);
  }

  const toggleConfirm = () => {

    const title = (id === 0) ? "Confirmer l'ajout de la plat" : "Confirmer la mise à jour de la plat";
    const buttonText = (id === 0) ? "Ajouter" : "Mettre à jour";
    const successText = (id === 0) ? "Plat ajoutée avec succès" : "Plat mise à jour avec succès"

    swal({
      text: title,
      title: "Confirmation",
      icon: "info",
      buttons: ["Annuler", buttonText],
      dangerMode: true
    }).then((isConfirm) => {
      if(isConfirm){
        setLoader(true)
        const formData = new FormData()
        formData.append('name', name)
        formData.append('description', description)
        formData.append('foodType', type)
        formData.append('foodCategory', category)
        formData.append('nutritional_value', nutritional)
        formData.append('price', price)
        const times = new Date(timer * 1000).toISOString().slice(11, 19);
        formData.append('cooking_time', times)
        for(let i = 0; i < ingredient.length; i++){
          formData.append('ingredients['+ i +']', ingredient[i].name)
        }
        if(id === 0) {
          formData.append('foodPicture', files[0])
          foodService.create(formData).then((response) => {
            setLoader(false)
            dispatch(fetchPlates())
            resetForm()
            toggle()
            swal(successText, {
              icon: 'success'
            })
          }).catch((err) => {
            setLoader(false)
            if(err.response.data.message.includes("foodPicture")){
              swal("Erreur", "L'image du plat est invalide", "error");
            }
            else if(err.response.status === 409){
              swal("Erreur", err.response.data.message, "error");
            }
            else if (err) {
              swal("Erreur", err.message, "error");
            } else {
              swal.stopLoading();
              swal.close();
            }
          })
        }
        else {
          if(files.length > 0) {
            formData.append('foodPicture', files[0])
          }
          else{
            formData.append('foodPicture', "")
          }
          foodService.update(id, formData).then((response) => {
            setLoader(false)
            dispatch(fetchPlates())
            resetForm()
            toggle()
            swal(successText, {
              icon: 'success'
            })
          }).catch((err) => {
            setLoader(false)
            if(err.response.data.message.includes("foodPicture")){
              swal("Erreur", "L'image du plat est invalide", "error");
            }
            else if(err.response.status === 409){
              swal("Erreur", err.response.data.message, "error");
            }
            else if (err) {
              swal("Erreur", err.message, "error");
            } else {
              swal.stopLoading();
              swal.close();
            }
          })
        }
      }
    });
  };

  function toSecond(time) {
    const [hours, minutes, seconds] = time.split(':');
    return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
  }

  const toggleConfirmDelete = (p) => {
    swal({
      text: "Confirmer la suppréssion du plat",
      title: "Suppréssion",
      icon: "warning",
      buttons: ["Non", "Oui"],
    }).then((value) => {
      if(value){
        foodService.remove(p.id).then(()=>{
          dispatch(removeItem(p))
          setMessage('Plat supprimée avec succès.')
          setItemToDelete(p)
          swal("Plat supprimée avec succès", {
            icon: 'success'
          })
        }).catch(err => {
          console.log(err)
          swal("Erreur lors du traitement de la requete", {
            icon: 'error'
          })
        })
      }
    });
  }

  const toggleShow = () => setShow(!show);

  const resetForm = () => {
    setId(0)
    setName('')
    setCategory('')
    setPrice('')
    setDescription('')
    setNutritional('')
    setCategory('')
    setType('')
    setTimer('')
    setIngredient([])
    setFiles([])
    setImage('')
  }

  const handleFilter = (event) => {
    console.log(event)
  }

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    switch(name) {
      case 'name': setName(value); break;
      case 'price': setPrice(value); break;
      case 'category': setCategory(value); break;
      case 'type': setType(value); break;
      case 'description': setDescription(value); break;
      case 'nutritional': setNutritional(value); break;
      case 'ingredients': setIngredients(value); break;
      case 'time': setTimer(value); break;
      default: break;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if(name === ''){
      setVname(true)
    }
    if(price <= 0){
      setVprice(true)
    }
    if(category === null){
      setVcategory(true)
    }
    if(type === null){
      setVtype(true)
    }
    if(name !== '' && price > 0 && type !== null && category !== null)
    {
      setVname(false)
      setVprice(false)
      setVtype(false)
      setVcategory(false)
      toggleConfirm()
    }
  }
  
  const edit = (plate) => {
    setId(plate.id)
    setName(plate.name)
    setPrice(plate.price)
    setCategory(plate.foodCategory.id)
    setDescription(plate.description)
    setType(plate.foodType.id)
    setNutritional(plate.nutritional_value)
    setTimer(toSecond(plate.cooking_time))
    const ingredients = []
    for(var i = 0; i < plate.ingredients.length; i++){
      ingredients.push(plate.ingredients[i])
    }
    console.log(ingredients)
    setIngredient(ingredients)
    setFiles([]);
    setImage(plate.foodPicture)
    setModal(true)
  }

  const handleDelete = (plate) => {
    toggleConfirmDelete(plate)
  }

  const textFilter = ' Afficher par'
  const filters = [
    { value: 'name', label: 'Nom' },
    { value: 'price', label: 'Prix' },
    { value: 'category', label: 'Catégorie' }
  ]

  const closeBtn = (
    <FontAwesomeIcon className="close" onClick={toggle} style={{ cursor : "pointer", fontSize: "1.5rem" }} icon={faTimes} />
  );

  return (
    <Base>
      <div className="app-inner-layout">

        <div className="app-inner-layout__header-boxed p-0">
          <div className="app-inner-layout__header text-dark bg-white mb-4 d-flex justify-content-between align-content-center">
            <div className='filter-container'>
              <Select
                onChange={handleFilter}
                defaultValue={
                  {label: <Fragment>
                    <FontAwesomeIcon icon="bars"/> 
                      {textFilter}
                    </Fragment>,
                    value: ""
                  }
                }
                type="select" 
                name="filter" 
                id="filter"
                options={filters} >
              </Select>
            </div>
            <h1 className='fs-3 pt-2'>Gestion des plats</h1>
            <Button className='btn-icon btn-icon-only pt-0 ps-2 wazi-btn-add float-end wazi-btn' onClick={toggle}>
              <FontAwesomeIcon icon="plus" />
            </Button>
          </div>
        </div>

        <Row>
          <SweetAlert title={message}  show={show}
            type="success" onConfirm={toggleShow}/>
          <Col md="12">
            <Modal className='wazi-modal' isOpen={modal} toggle={toggle} size="lg" backdrop="static">
              <ModalHeader style={{ fontSize: "1.5rem" }} toggle={toggle} close={closeBtn}>
                <FontAwesomeIcon icon="utensils" /> 
                &nbsp;&nbsp;{ id === 0 ? "Ajouter un plat" : "Mise à jour d'un plat"}
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
                      <Form onSubmit={e => {handleSubmit(e)}}>

                        <FormGroup row>
                          <Label for="photo" sm={3}>
                            Photo **<br/><span className='text-muted'>(Recommandée)</span>
                          </Label>
                          <Col sm={3} {...getRootProps({ className: 'wazi-dropzone text-center' })}>
                            <input {...getInputProps()} type="file" name="photo" id="photo" />
                            <FormText className="text-center" color="muted">
                              Rechercher ou Déposer une photo ici
                            </FormText>

                          </Col>
                          {
                            files.length > 0 ?
                                <Col sm={3} className="thumbs-container">
                                  {thumbs}
                                </Col>
                                :
                                <>
                                {
                                  image ?
                                      <Col sm={3} className="thumbs-container"><div className='thumbs'>
                                        <div className='thumbs-inner'>
                                          <img
                                              src={image}
                                              alt="WaziEats"
                                          />
                                        </div>
                                      </div></Col> : <></>
                                }
                                </>
                          }
                        </FormGroup>
                        <FormGroup row>
                          <Label for="name" sm={3}>
                            Nom du plat
                          </Label>
                          <Col sm={9}>
                            <Input
                                value={name}
                                invalid={vName}
                                onChange={handleChange}
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Entrer le nom du plat"/>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for="description" sm={3}>
                            Description sur le plat
                          </Label>
                          <Col sm={9}>
                            <Input
                                value={description}
                                onChange={handleChange}
                                disabled={dDesc}
                                type="textarea"
                                name="description"
                                id="description"
                                placeholder="Entrer la description du plat"/>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for="category" sm={3}>
                            Catégorie du plat
                          </Label>
                          <Col sm={9}>
                            <Input
                                value={category}
                                onChange={handleChange}
                                type="select"
                                name="category"
                                invalid={vCategory}
                                disabled={dCategory}
                                id="category" >
                              <option value="">Sélectionner une catégorie</option>
                              {categories.map((category) => (
                                  <option value={category.id}>
                                    {category.name}
                                  </option>
                              ))}
                            </Input>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for="category" sm={3}>
                            Type de plat
                          </Label>
                          <Col sm={9}>
                            <Input
                                value={type}
                                onChange={handleChange}
                                type="select"
                                invalid={vType}
                                disabled={dType}
                                name="type"
                                id="type" >
                              <option value="">Sélectionner un type</option>
                              {types.map((type) => (
                                  <option value={type.id}>
                                    {type.name}
                                  </option>
                              ))}
                            </Input>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for="price" sm={3}>
                            Prix du plat
                          </Label>
                          <Col sm={9}>
                            <Input
                                value={price}
                                invalid={vPrice}
                                onChange={handleChange}
                                type="number"
                                name="price"
                                id="price"
                                placeholder="Entrer le prix du plat"/>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for="nutritional" sm={3}>
                            Valeur nutritionnelle
                          </Label>
                          <Col sm={9}>
                            <Input
                                value={nutritional}
                                onChange={handleChange}
                                type="text"
                                name="nutritional"
                                id="nutritional"
                                placeholder="Entrer la valeur nutritionnelle du plat"/>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for="origin" sm={3}>
                            Temps de cuisson
                          </Label>
                          <Col sm={9}>
                            <Input
                                value={timer}
                                onChange={handleChange}
                                step="2"
                                type="number"
                                name="time"
                                id="time"
                                placeholder="Entrer le temps de cuisson du plat (En minutes)"/>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for="ingredients" sm={3}>
                            Ingrédients du plat
                          </Label>
                          <Col sm={9}>
                            <Multiselect
                                value={ingredient}
                                data={ingredients}
                                onChange={(value) => setIngredient(value)}
                                dataKey="id"
                                textField="name"
                                name="ingredients"
                                id="ingredients" />
                          </Col>
                        </FormGroup>
                        <FormGroup>
                          <Input
                              value={id}
                              onChange={handleChange}
                              type="hidden"
                              name="id"
                              id="id" />
                        </FormGroup>

                        {/*<Row className="row-cols-lg-auto mb-4 g-3 align-items-center">*/}
                        {/*  <Col sm={3}>*/}
                        {/*    Tags*/}
                        {/*  </Col>*/}
                        {/*  <Col sm={4}>*/}
                        {/*    <Label*/}
                        {/*        className="visually-hidden"*/}
                        {/*        for="tag"*/}
                        {/*    >*/}
                        {/*      Tags*/}
                        {/*    </Label>*/}
                        {/*    <Input*/}
                        {/*        id="tag"*/}
                        {/*        name="tag"*/}
                        {/*        placeholder=""*/}
                        {/*        type="text"*/}
                        {/*    />*/}
                        {/*  </Col>*/}
                        {/*  <Col sm={2}>*/}
                        {/*    <Button block type='button' className="wazi-btn">*/}
                        {/*      Compl&eacute;ment*/}
                        {/*    </Button>*/}
                        {/*  </Col>*/}
                        {/*</Row>*/}
                        {/*<FormGroup row>*/}
                        {/*  <Col sm={3}>*/}
                        {/*    <UncontrolledDropdown>*/}
                        {/*      <DropdownToggle*/}
                        {/*          dropup={true}*/}
                        {/*          caret*/}
                        {/*          color="success"*/}
                        {/*      >*/}
                        {/*        Suggestions*/}
                        {/*      </DropdownToggle>*/}

                        {/*      <DropdownMenu>*/}

                        {/*        <DropdownItem header>*/}
                        {/*          <InputGroup size="sm" className="mt-1">*/}
                        {/*            <InputGroupText style={{ color: "#ccc", backgroundColor: "#eee", borderColor: "#eee" }}>*/}
                        {/*              <FontAwesomeIcon style={{ cursor : "pointer" }} icon={faSearch} />*/}
                        {/*            </InputGroupText>*/}
                        {/*            <Input*/}
                        {/*                type={"text"}*/}
                        {/*                name="search"*/}
                        {/*                id="suggest"*/}
                        {/*                style={{ backgroundColor: "#eee", borderColor: "#eee" }}*/}
                        {/*                bsSize="sm"*/}
                        {/*                placeholder="Suggestions"*/}
                        {/*            />*/}
                        {/*            <InputGroupText style={{ color: "red", backgroundColor: "#eee", borderColor: "#eee" }}>*/}
                        {/*              <FontAwesomeIcon style={{ cursor : "pointer" }} icon={faTimes} />*/}
                        {/*            </InputGroupText>*/}
                        {/*          </InputGroup>*/}
                        {/*        </DropdownItem>*/}

                        {/*        <div className='px-3'>*/}
                        {/*          <SimpleGrid columns={2}>*/}
                        {/*            {['sm', 'sm',].map((size) => (*/}
                        {/*                <Tag*/}
                        {/*                    size={size}*/}
                        {/*                    key={size}*/}
                        {/*                    className='py-1'*/}
                        {/*                    borderRadius='full'*/}
                        {/*                    variant='solid'*/}
                        {/*                    colorScheme='white.100'*/}
                        {/*                >*/}
                        {/*                  <TagLabel color={'black'}>Pepsi</TagLabel>*/}
                        {/*                  <TagCloseButton color={'red'} />*/}
                        {/*                </Tag>*/}
                        {/*            ))}*/}
                        {/*          </SimpleGrid>*/}
                        {/*        </div>*/}

                        {/*        <DropdownItem divider />*/}

                        {/*        <DropdownItem>*/}
                        {/*          <Row style={{ minWidth: "100%" }}>*/}
                        {/*            <Col sm={4}>*/}
                        {/*              <Avatar*/}
                        {/*                  src='https://pbs.twimg.com/profile_images/1255241280856227841/Pcm8Xpj4_400x400.jpg'*/}
                        {/*                  size='md'*/}
                        {/*                  name='Segun Adebayo'*/}
                        {/*                  ml={-1}*/}
                        {/*                  mr={2}*/}
                        {/*              />*/}
                        {/*            </Col>*/}
                        {/*            <Col sm={6}>*/}
                        {/*              <Row><b>Pepsi</b></Row>*/}
                        {/*              <Row><b className='wazieats-color'>800 FCFA</b></Row>*/}
                        {/*            </Col>*/}
                        {/*            <Col sm={2} className="justify-content-center align-self-center">*/}
                        {/*              <Checkbox defaultChecked></Checkbox>*/}
                        {/*            </Col>*/}
                        {/*          </Row>*/}
                        {/*        </DropdownItem>*/}
                        {/*        <DropdownItem>*/}
                        {/*          <Row style={{ minWidth: "100%" }}>*/}
                        {/*            <Col sm={4}>*/}
                        {/*              <Avatar*/}
                        {/*                  src='https://pbs.twimg.com/profile_images/1255241280856227841/Pcm8Xpj4_400x400.jpg'*/}
                        {/*                  size='md'*/}
                        {/*                  name='Segun Adebayo'*/}
                        {/*                  ml={-1}*/}
                        {/*                  mr={2}*/}
                        {/*              />*/}
                        {/*            </Col>*/}
                        {/*            <Col sm={6}>*/}
                        {/*              <Row><b>Pepsi</b></Row>*/}
                        {/*              <Row><b className='wazieats-color'>800 FCFA</b></Row>*/}
                        {/*            </Col>*/}
                        {/*            <Col sm={2} className="justify-content-center align-self-center">*/}
                        {/*              <Checkbox></Checkbox>*/}
                        {/*            </Col>*/}
                        {/*          </Row>*/}
                        {/*        </DropdownItem>*/}
                        {/*        <DropdownItem>*/}
                        {/*          <Row style={{ minWidth: "100%" }}>*/}
                        {/*            <Col sm={4}>*/}
                        {/*              <Avatar*/}
                        {/*                  src='https://pbs.twimg.com/profile_images/1255241280856227841/Pcm8Xpj4_400x400.jpg'*/}
                        {/*                  size='md'*/}
                        {/*                  name='Segun Adebayo'*/}
                        {/*                  ml={-1}*/}
                        {/*                  mr={2}*/}
                        {/*              />*/}
                        {/*            </Col>*/}
                        {/*            <Col sm={6}>*/}
                        {/*              <Row><b>Pepsi</b></Row>*/}
                        {/*              <Row><b className='wazieats-color'>800 FCFA</b></Row>*/}
                        {/*            </Col>*/}
                        {/*            <Col sm={2} className="justify-content-center align-self-center">*/}
                        {/*              <Checkbox></Checkbox>*/}
                        {/*            </Col>*/}
                        {/*          </Row>*/}
                        {/*        </DropdownItem>*/}
                        {/*        <DropdownItem>*/}
                        {/*          <Row style={{ minWidth: "100%" }}>*/}
                        {/*            <Col sm={4}>*/}
                        {/*              <Avatar*/}
                        {/*                  src='https://pbs.twimg.com/profile_images/1255241280856227841/Pcm8Xpj4_400x400.jpg'*/}
                        {/*                  size='md'*/}
                        {/*                  name='Segun Adebayo'*/}
                        {/*                  ml={-1}*/}
                        {/*                  mr={2}*/}
                        {/*              />*/}
                        {/*            </Col>*/}
                        {/*            <Col sm={6}>*/}
                        {/*              <Row><b>Pepsi</b></Row>*/}
                        {/*              <Row><b className='wazieats-color'>800 FCFA</b></Row>*/}
                        {/*            </Col>*/}
                        {/*            <Col sm={2} className="justify-content-center align-self-center">*/}
                        {/*              <Checkbox></Checkbox>*/}
                        {/*            </Col>*/}
                        {/*          </Row>*/}
                        {/*        </DropdownItem>*/}


                        {/*      </DropdownMenu>*/}
                        {/*    </UncontrolledDropdown>*/}
                        {/*  </Col>*/}
                        {/*</FormGroup>*/}

                        <FormGroup check row className='mt-5'>
                          <Col sm={{ size: 2, offset: 10 }}>
                            <Button type="submit" block className="wazi-btn">{ id === 0 ? "Ajouter" : "Mettre à jour"}</Button>
                          </Col>
                        </FormGroup>

                      </Form>
                }
              </ModalBody>
            </Modal>
          </Col>
        </Row>
        
        <LoadingOverlay tag="div" active={loading}
          styles={{
            overlay: (base) => ({
              ...base,
              background: "#fff",
              opacity: 0.5,
            }),
          }}
          spinner={<Loader active={loading} type='ball-pulse-rise' />}>
          <Row>
            {data.map((item) => (
              <Col key={`plate-${item.id}`} md="12" lg="6" xl="3">
                <Card className="wazi-card-item card-shadow-primary card-border text-white mb-3">
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
                  <Item name={item.name} price={item.price} image={item.foodPicture} />
                  <div className='item-detail'>
                    <h5 style={{ position: "absolute", bottom: "50%", left: "35%" }}>Détails du plat</h5>
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

export default Plates
