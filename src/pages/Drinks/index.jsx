import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Redirect } from 'react-router-dom';
import { useState } from 'react';
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faWineBottle, faPlus, faWindowClose, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDropzone } from 'react-dropzone';
import {
  Button,
  Card,
  CardHeader,
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
  UncontrolledDropdown,
  DropdownToggle,
  InputGroupText,
  InputGroup,
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import logo from '../../assets/logo.png'
import noImg from '../../assets/img.png'
import Base from '../Base';
import Item from '../../components/Item';
import { selectDrinks } from '../../utils/selectors';
import { isLoggedIn } from '../../utils/selectors';
import { addItem, fetchDrinks, removeItem, endLoading, setLoading } from '../../features/drinks';
import swal from 'sweetalert';
import { Loader } from "react-loaders";
import LoadingOverlay from "react-loading-overlay-ts";
import drinkService from '../../services/drinkService';
import Select from 'react-select'
import AsyncCreatableSelect from 'react-select/async-creatable';
import axios from 'axios';
import {Avatar, Checkbox, SimpleGrid, Spinner, Tag, TagCloseButton, TagLabel, useToast} from '@chakra-ui/react'

library.add(
  fab,
  faWineBottle,
  faPlus
);

function Drinks() {

  const dispatch = useDispatch()
  const { loading, error, data } = useSelector(selectDrinks)

  const isConnected = useSelector(isLoggedIn)

  const [ name, setName ] = useState('')
  const [ desc, setDesc ] = useState('')
  const [ category, setCategory ] = useState('')
  const [ type, setType ] = useState('')
  const [ price, setPrice ] = useState('')
  const [ img, setImg ] = useState(true)
  const [ image, setImage ] = useState("")
  const [ id, setId ] = useState(0)
  const [ adminid, setAdminId ] = useState(1)

  const [ loader, setLoader ] = useState(false)
  //const [ filter, setFilter ] = useState('')
  const [ modal, setModal ] = useState(false)
  const [ confirmModal, setConfirmModal ] = useState(false)
  const [ confirmDelete, setConfirmDelete ] = useState(false)
  const [ message, setMessage ] = useState('')
  const [ show, setShow ] = useState('')
  const [ itemToDelete, setItemToDelete ] = useState(null)

  useEffect(() => {
    dispatch(fetchDrinks())
  }, [dispatch])

  if (!isConnected) {
    return <Redirect to='/login'/>
  }

  const [ categories, setCategories ] = useState([])
  const [ types, setTypes ] = useState([])

  useEffect(() => {
    drinkService.getDrinkCategory()
      .then((response) => {
        setCategories(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
    
      drinkService.getDrinkType()
      .then((response) => {
        setTypes(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])
  
  const toggle = () => {
    resetForm()
    setModal(!modal);
  }
  
  const toggleConfirm = () => {

    const title = (id === 0) ? "Confirmer l'ajout de la boisson" : "Confirmer la mise à jour de la boisson";
    const buttonText = (id === 0) ? "Ajouter" : "Mettre à jour";
    const successText = (id === 0) ? "Boisson ajoutée avec succès" : "Boisson mise à jour avec succès"
    swal({
      text: title,
      title: "Confirmation",
      icon: "info",
      buttons: ["Annuler", buttonText],
      dangerMode: true
    })
    .then(isConfirm => {
      if(isConfirm){
          setLoader(true)
          const formData = new FormData();
          if(adminid){
              formData.append("name", name)
              formData.append("admin_drink", adminid)
          }
          else{
              formData.append("name", name)
              formData.append("description", desc)
              formData.append("drinkCategory", category)
              formData.append("drinkType", type)
              if(!image){
                  formData.append("drinkPicture", files[0])
              }
              else{
                  formData.append("drinkPicture", "")
              }
          }
          formData.append("price", price)
          if(id === 0){
              return drinkService.create(formData).then((response) => {
                  dispatch(fetchDrinks())
                  resetForm()
                  setLoader(false)
                  toggle()
                  swal(successText, {
                      icon: 'success'
                  })
              }).catch(err => {
                  setLoader(false)
                      if(err.response.data.message.includes("drinkPicture")){
                          swal("Erreur", "L'image de la boisson est invalide", "error");
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
          else{
              return drinkService.update(id, formData).then((response) => {
                  dispatch(fetchDrinks())
                  setLoader(false)
                  resetForm()
                  toggle()
                  swal(successText, {
                      icon: 'success'
                  })
              }).catch(err => {
                  setLoader(false)
                      if(err.response.data.message.includes("drinkPicture")){
                          swal("Erreur", "L'image de la boisson est invalide", "error");
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
    })
  };

  const toggleConfirmDelete = (d) => {
    swal({
      text: "Confirmer la suppréssion de la boisson",
      title: "Suppréssion",
      icon: "warning",
      buttons: ["Non", "Oui"],
    }).then((value) => {
      if(value){
        drinkService.remove(d.id).then(()=>{
          dispatch(removeItem(d))
          setMessage('Boisson supprimée avec succès.')
          setItemToDelete(d)
          swal("Boisson supprimée avec succès", {
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

  const toggleShow = () => setShow(!show);

  const resetForm = () => {
    setId(0)
    setName('')
    setCategory('')
    setDesc('')
    setType('')
    setPrice('')
    setFiles([])
    setAdminId('')
    setImage('')

    setImg(true)

    setVname(false)
    setVprice(false)
    setVtype(false)
    setVcategory(false)

    setDtype(false)
    setDcategory(false)
    setDdesc(false)
    setDname(false)
    setDImg(false)
  }

  const handleFilter = (event) => {
    setFilter(event.target.value)
    console.log(event.value)
  }

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    switch(name) {
      case 'name': setName(value); break;
      case 'desc': setDesc(value); break;
      case 'price': setPrice(value); break;
      case 'category': setCategory(value); break;
      case 'type': setType(value); break;
      default: break;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if(name === ''){
      setVname(true)
    }
    else if(price <= 0){
      setVprice(true)
    }
    else
    {
      setVname(false)
      setVprice(false)
      setVtype(false)
      setVcategory(false)
      toggleConfirm()
    }
  }
  
  const edit = (drink) => {
    resetForm()
    if(drink.admin_drink.id){
      setDcategory(true)
      setDtype(true)
      setDname(true)
      setDdesc(true)
      setDImg(true)
      setModal(true)
      let ima = drink.drinkPicture ? drink.drinkPicture : drink.admin_drink.drinkPicture
      setImage(ima)
      setId(drink.id)
      let c = (drink.drinkCategory.id ? drink.drinkCategory.id : (drink.admin_drink.drinkCategory ? drink.admin_drink.drinkCategory : ""))
      setCategory(c)
      let t = (drink.drinkType.id ? drink.drinkType.id : (drink.admin_drink.drinkType ? drink.admin_drink.drinkType : ""))
      setName(drink.name)
      setPrice(drink.price)
      setDesc(drink.description)
      setAdminId(drink.admin_drink.id)
      setType(t)
    }
    else{
      setDcategory(false)
      setDtype(false)
      setId(drink.id)
      setAdminId()
      setName(drink.name)
      setPrice(drink.price)
      setDesc(drink.description)
      let ima = drink.drinkPicture ? drink.drinkPicture : drink.admin_drink.drinkPicture
      setImage(ima)
      let c = (drink.drinkCategory.id ? drink.drinkCategory.id : (drink.admin_drink.drinkCategory ? drink.admin_drink.drinkCategory : ""))
      setCategory(c)
      let t = (drink.drinkType.id ? drink.drinkType.id : (drink.admin_drink.drinkType ? drink.admin_drink.drinkType : ""))
      setType(t)
      setModal(true)
    }
  }

  const handleDelete = (drink) => {
    toggleConfirmDelete(drink)
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

  const [files, setFiles] = useState([]);

  const {
    getRootProps,
    getInputProps
  } = useDropzone({
    multiple: false,
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
      setImage("")
    },
    
  });


  let thumbs = files.map(file => (
    <div className='thumbs' key={file.name}>
      <div className='thumbs-inner'>
        <img
          src={file.preview}
          alt={file.name}
          onLoad={() => { URL.revokeObjectURL(file.preview) }}
        />
      </div>
    </div>
  ));
  
  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  function getFilenameFromContentDisposition(res) {
      let filename = null;

      const disposition = res.headers.get("content-disposition");

      if (disposition?.includes("attachment")) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(disposition);
          if (matches?.[1]) {
          filename = matches[1].replace(/['"]/g, "");
          // Sometimes the filename comes in a URI encoded format so decode it
          filename = decodeURIComponent(filename);
          // Sometimes the filename starts with UTF-8, remove that
          filename = filename.replace(/^UTF-8/i, "").trim();
          }
      }
      // return filename;
      return "image";
  }

  async function getFileFromLink(url) {
      const fileRes = await fetch(url);
      // const fileRes = await fetch('http://localhost:3000/static/media/city3.ce19ba6626e726fff487.jpg');
      const blob = await fileRes.blob();

      let fileName = getFilenameFromContentDisposition(fileRes);
      if (!fileName) {
          fileName = url.split("/").pop();
      }

      const file = new File([blob], fileName + "." + getExtension(blob.type), {
          type: blob.type,
      });

      return file;
  }

  const getExtension = (ext) =>{
    const types = {
      //   File Extension   MIME Type
        'abs':           'audio/x-mpeg',
        'ai':            'application/postscript',
        'aif':           'audio/x-aiff',
        'aifc':          'audio/x-aiff',
        'aiff':          'audio/x-aiff',
        'aim':           'application/x-aim',
        'art':           'image/x-jg',
        'asf':           'video/x-ms-asf',
        'asx':           'video/x-ms-asf',
        'au':            'audio/basic',
        'avi':           'video/x-msvideo',
        'avx':           'video/x-rad-screenplay',
        'bcpio':         'application/x-bcpio',
        'bin':           'application/octet-stream',
        'bmp':           'image/bmp',
        'body':          'text/html',
        'cdf':           'application/x-cdf',
        'cer':           'application/pkix-cert',
        'class':         'application/java',
        'cpio':          'application/x-cpio',
        'csh':           'application/x-csh',
        'css':           'text/css',
        'dib':           'image/bmp',
        'doc':           'application/msword',
        'dtd':           'application/xml-dtd',
        'dv':            'video/x-dv',
        'dvi':           'application/x-dvi',
        'eot':           'application/vnd.ms-fontobject',
        'eps':           'application/postscript',
        'etx':           'text/x-setext',
        'exe':           'application/octet-stream',
        'gif':           'image/gif',
        'gtar':          'application/x-gtar',
        'gz':            'application/x-gzip',
        'hdf':           'application/x-hdf',
        'hqx':           'application/mac-binhex40',
        'htc':           'text/x-component',
        'htm':           'text/html',
        'html':          'text/html',
        'ief':           'image/ief',
        'jad':           'text/vnd.sun.j2me.app-descriptor',
        'jar':           'application/java-archive',
        'java':          'text/x-java-source',
        'jnlp':          'application/x-java-jnlp-file',
        'jpeg':          'image/jpeg',
        'jpg':           'image/jpeg',
        'js':            'application/javascript',
        'jsf':           'text/plain',
        'json':          'application/json',
        'jspf':          'text/plain',
        'kar':           'audio/midi',
        'latex':         'application/x-latex',
        'm3u':           'audio/x-mpegurl',
        'mac':           'image/x-macpaint',
        'man':           'text/troff',
        'mathml':        'application/mathml+xml',
        'me':            'text/troff',
        'mid':           'audio/midi',
        'midi':          'audio/midi',
        'mif':           'application/x-mif',
        'mov':           'video/quicktime',
        'movie':         'video/x-sgi-movie',
        'mp1':           'audio/mpeg',
        'mp2':           'audio/mpeg',
        'mp3':           'audio/mpeg',
        'mp4':           'video/mp4',
        'mpa':           'audio/mpeg',
        'mpe':           'video/mpeg',
        'mpeg':          'video/mpeg',
        'mpega':         'audio/x-mpeg',
        'mpg':           'video/mpeg',
        'mpv2':          'video/mpeg2',
        'ms':            'application/x-wais-source',
        'nc':            'application/x-netcdf',
        'oda':           'application/oda',
        'odb':           'application/vnd.oasis.opendocument.database',
        'odc':           'application/vnd.oasis.opendocument.chart',
        'odf':           'application/vnd.oasis.opendocument.formula',
        'odg':           'application/vnd.oasis.opendocument.graphics',
        'odi':           'application/vnd.oasis.opendocument.image',
        'odm':           'application/vnd.oasis.opendocument.text-master',
        'odp':           'application/vnd.oasis.opendocument.presentation',
        'ods':           'application/vnd.oasis.opendocument.spreadsheet',
        'odt':           'application/vnd.oasis.opendocument.text',
        'otg':           'application/vnd.oasis.opendocument.graphics-template',
        'oth':           'application/vnd.oasis.opendocument.text-web',
        'otp':           'application/vnd.oasis.opendocument.presentation-template',
        'ots':           'application/vnd.oasis.opendocument.spreadsheet-template',
        'ott':           'application/vnd.oasis.opendocument.text-template',
        'ogx':           'application/ogg',
        'ogv':           'video/ogg',
        'oga':           'audio/ogg',
        'ogg':           'audio/ogg',
        'otf':           'application/x-font-opentype',
        'spx':           'audio/ogg',
        'flac':          'audio/flac',
        'anx':           'application/annodex',
        'axa':           'audio/annodex',
        'axv':           'video/annodex',
        'xspf':          'application/xspf+xml',
        'pbm':           'image/x-portable-bitmap',
        'pct':           'image/pict',
        'pdf':           'application/pdf',
        'pgm':           'image/x-portable-graymap',
        'pic':           'image/pict',
        'pict':          'image/pict',
        'pls':           'audio/x-scpls',
        'png':           'image/png',
        'pnm':           'image/x-portable-anymap',
        'pnt':           'image/x-macpaint',
        'ppm':           'image/x-portable-pixmap',
        'ppt':           'application/vnd.ms-powerpoint',
        'pps':           'application/vnd.ms-powerpoint',
        'ps':            'application/postscript',
        'psd':           'image/vnd.adobe.photoshop',
        'qt':            'video/quicktime',
        'qti':           'image/x-quicktime',
        'qtif':          'image/x-quicktime',
        'ras':           'image/x-cmu-raster',
        'rdf':           'application/rdf+xml',
        'rgb':           'image/x-rgb',
        'rm':            'application/vnd.rn-realmedia',
        'roff':          'text/troff',
        'rtf':           'application/rtf',
        'rtx':           'text/richtext',
        'sfnt':          'application/font-sfnt',
        'sh':            'application/x-sh',
        'shar':          'application/x-shar',
        'sit':           'application/x-stuffit',
        'snd':           'audio/basic',
        'src':           'application/x-wais-source',
        'sv4cpio':       'application/x-sv4cpio',
        'sv4crc':        'application/x-sv4crc',
        'svg':           'image/svg+xml',
        'svgz':          'image/svg+xml',
        'swf':           'application/x-shockwave-flash',
        't':             'text/troff',
        'tar':           'application/x-tar',
        'tcl':           'application/x-tcl',
        'tex':           'application/x-tex',
        'texi':          'application/x-texinfo',
        'texinfo':       'application/x-texinfo',
        'tif':           'image/tiff',
        'tiff':          'image/tiff',
        'tr':            'text/troff',
        'tsv':           'text/tab-separated-values',
        'ttf':           'application/x-font-ttf',
        'txt':           'text/plain',
        'ulw':           'audio/basic',
        'ustar':         'application/x-ustar',
        'vxml':          'application/voicexml+xml',
        'xbm':           'image/x-xbitmap',
        'xht':           'application/xhtml+xml',
        'xhtml':         'application/xhtml+xml',
        'xls':           'application/vnd.ms-excel',
        'xml':           'application/xml',
        'xpm':           'image/x-xpixmap',
        'xsl':           'application/xml',
        'xslt':          'application/xslt+xml',
        'xul':           'application/vnd.mozilla.xul+xml',
        'xwd':           'image/x-xwindowdump',
        'vsd':           'application/vnd.visio',
        'wav':           'audio/x-wav',
        'wbmp':          'image/vnd.wap.wbmp',
        'wml':           'text/vnd.wap.wml',
        'wmlc':          'application/vnd.wap.wmlc',
        'wmls':          'text/vnd.wap.wmlsc',
        'wmlscriptc':    'application/vnd.wap.wmlscriptc',
        'wmv':           'video/x-ms-wmv',
        'woff':          'application/font-woff',
        'woff2':         'application/font-woff2',
        'wrl':           'model/vrml',
        'wspolicy':      'application/wspolicy+xml',
        'z':             'application/x-compress',
        'zip':           'application/zip'
    };
    return Object.keys(types).find(key => types[key] === ext);
  }

  const [ vName, setVname ] = useState(false)
  const [ vPrice, setVprice ] = useState(false)
  const [ vType, setVtype ] = useState(false)
  const [ vCategory, setVcategory ] = useState(false)

  const [ dType, setDtype ] = useState(false)
  const [ dCategory, setDcategory ] = useState(false)
  const [ dDesc, setDdesc ] = useState(false)
  const [ dName, setDname ] = useState(false)
  const [ dImg, setDImg ] = useState(false)

  const loadOptions = () => {
    return drinkService.getAdmin()
      .then((response) => {
        const options = []
        response.data.forEach((permission) => {
          options.push({
            label: permission.name,
            value: permission.id
          })
        })
        return options
      })
  }

  const toast = useToast()

  const isEmpty = (s) => {
    return typeof s === 'undefined' || s === null || s === ""
  }

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
              <h1 className='fs-3 pt-2'>Gestion des boissons</h1>
              <div>
                <Button className='btn-icon btn-icon-only pt-0 ps-2 wazi-btn-add float-end wazi-btn' onClick={toggle}>
                  <FontAwesomeIcon icon="plus" />
                </Button>
              </div>
          </div>
        </div>

        <Row>
          
          <Col md="12">
            <Modal className='wazi-modal' isOpen={modal} toggle={toggle} size="lg" backdrop="static">
              <ModalHeader style={{ fontSize: "1.5rem" }} toggle={toggle} close={closeBtn}>
                <FontAwesomeIcon icon="wine-bottle" /> 
                &nbsp;&nbsp;{ id === 0 ? "Ajouter une boisson" : "Mise à jour d'une boisson"}
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
                                  {
                                      id === 0 ?
                                          <>
                                              {
                                                  dImg ?
                                                      <>
                                                          <Col sm={3} className="thumbs-container">
                                                              <div className='thumbs'>
                                                                  <div className='thumbs-inner'>
                                                                      <img
                                                                          src={noImg}
                                                                          alt="WaziEats"
                                                                      />
                                                                  </div>
                                                              </div>
                                                          </Col>
                                                      </>
                                                      :
                                                      <>
                                                          {
                                                              img ?
                                                                  <Col sm={6} {...getRootProps({ className: 'wazi-dropzone' })}>
                                                                      <input {...getInputProps()} type="file" name="photo" id="photo" />
                                                                      <FormText color="muted">
                                                                          Recherchez ou Glisser/déposer une photo ici
                                                                          { files.length === 0 ? <><br/><b className='text-danger'>Une image est requis pour une boisson</b></> : <></>}
                                                                      </FormText>
                                                                  </Col>: <></>
                                                          }
                                                      </>
                                              }
                                              { files.length > 0 ? <Col sm={3} className="thumbs-container">
                                                  {thumbs}
                                              </Col> : "" }
                                              {
                                                  image ?
                                                      <Col sm={3} className="thumbs-container">
                                                          <div className='thumbs'>
                                                              <div className='thumbs-inner'>
                                                                  <img
                                                                      src={image}
                                                                      alt="WaziEats"
                                                                  />
                                                              </div>
                                                          </div>
                                                      </Col> : <></>
                                              }
                                          </> :
                                          <>
                                              {
                                                  !adminid ?
                                                      <Col sm={6} {...getRootProps({ className: 'wazi-dropzone' })}>
                                                          <input {...getInputProps()} type="file" name="photo" id="photo" />
                                                          <FormText color="muted">
                                                              Recherchez ou Glisser/déposer une photo ici
                                                              { files.length === 0 ? <><br/><b className='text-danger'>Une image est requis pour une boisson</b></> : <></>}
                                                          </FormText>
                                                      </Col> : <></>
                                              }
                                              { files.length > 0 ? <Col sm={3} className="thumbs-container">
                                                  {thumbs}
                                              </Col> : "" }
                                              {
                                                  image ?
                                                      <Col sm={3} className="thumbs-container">
                                                          <div className='thumbs'>
                                                              <div className='thumbs-inner'>
                                                                  <img
                                                                      src={image}
                                                                      alt="WaziEats"
                                                                  />
                                                              </div>
                                                          </div>
                                                      </Col> : <></>
                                              }
                                          </>
                                  }
                              </FormGroup>

                              <FormGroup row>
                                  <Label for="name" sm={3}>
                                      Nom de la boisson *
                                  </Label>
                                  <Col sm={9}>
                                      {
                                          id === 0 ?
                                              <AsyncCreatableSelect
                                                  noOptionsMessage={()=>"Créer une boisson"}
                                                  placeholder="Nom de la boisson"
                                                  loadingMessage={()=>"Chargement..."}
                                                  cacheOptions
                                                  defaultValue={{ label: name, value: name }}
                                                  isClearable
                                                  isDisabled={dName}
                                                  allowCreateWhileLoading
                                                  createOptionPosition="first"
                                                  onChange={(newValue) => {
                                                      if(newValue.hasOwnProperty('__isNew__')) {
                                                          setName(newValue.value)
                                                          setDcategory(false)
                                                          setDtype(false)
                                                          setDdesc(false)
                                                          setDImg(false)
                                                          if(id === 0){
                                                              setImg(true)
                                                              setFiles([])
                                                              setPrice(0)
                                                              thumbs.length = 0
                                                              toast({
                                                                  title: "Création d'une boisson",
                                                                  status: 'success',
                                                                  duration: 3000,
                                                                  isClosable: true,
                                                              })
                                                          }
                                                          setAdminId("")
                                                      }
                                                      else{
                                                          drinkService.getAdminID(newValue.value).then((response) => {
                                                              let cat = response.data.drinkCategory ? response.data.drinkCategory : ""
                                                              let typ = response.data.drinkType ? response.data.drinkType : ""
                                                              let ima = response.data.drinkPicture ? response.data.drinkPicture : ""
                                                              setCategory(cat)
                                                              setType(typ)
                                                              setAdminId(response.data.id)
                                                              setName(response.data.name)
                                                              setDesc(response.data.description)
                                                              setPrice(0)
                                                              // let im = ""
                                                              // getFileFromLink(ima).then((response) => {
                                                              //     im = response
                                                              //     im.preview = ima
                                                              // })
                                                              // setDtype(isEmpty(typ) ? false : true)
                                                              // setDcategory(isEmpty(cat) ? false : true)
                                                              setDtype(true)
                                                              if(ima){
                                                                  setDImg(false)
                                                                  setImage(ima)
                                                                  // setTimeout(() => setFiles([im]), 1000);
                                                                  setImg(false)
                                                              }
                                                              else{
                                                                  setDImg(true)
                                                                  setImg(true)
                                                                  setFiles([])
                                                              }
                                                              setDcategory(true)
                                                              setDdesc(true)
                                                          })
                                                      }
                                                  }}
                                                  defaultOptions
                                                  loadOptions={loadOptions}
                                              />
                                              :
                                              <Input
                                                  value={name}
                                                  onChange={handleChange}
                                                  type="text"
                                                  disabled={dName}
                                                  name="name"
                                                  id="name"
                                                  placeholder="Entrer le nom du plat"/>
                                      }
                                  </Col>
                              </FormGroup>

                              <FormGroup row>
                                  <Label for="name" sm={3}>
                                      Description
                                  </Label>
                                  <Col sm={9}>
                                      <Input
                                          value={desc}
                                          disabled={dDesc}
                                          onChange={handleChange}
                                          type="textarea"
                                          name="desc"
                                          id="desc"
                                          placeholder="Description de la boisson"/>
                                  </Col>
                              </FormGroup>

                              <FormGroup row>
                                  <Label for="category" sm={3}>
                                      Catégorie de boisson *
                                  </Label>
                                  <Col sm={9}>
                                      <Input
                                          value={category}
                                          onChange={handleChange}
                                          type="select"
                                          invalid={vCategory}
                                          disabled={dCategory}
                                          name="category"
                                          id="category" >
                                          <option value="">Sélectionner une catégorie</option>
                                          {categories.map((category, index) => (
                                              <option key={`category-${index}`} value={category.id}>
                                                  {category.name}
                                              </option>
                                          ))}
                                      </Input>
                                  </Col>
                              </FormGroup>

                              <FormGroup row>
                                  <Label for="type" sm={3}>
                                      Type de boisson *
                                  </Label>
                                  <Col sm={9}>
                                      <Input
                                          value={type}
                                          invalid={vType}
                                          disabled={dType}
                                          onChange={handleChange}
                                          type="select"
                                          name="type"
                                          id="type" >
                                          <option value="">Sélectionner un type</option>
                                          {types.map((t, index) => (
                                              <option key={`category-${index}`} value={t.id}>
                                                  {t.name}
                                              </option>
                                          ))}
                                      </Input>
                                  </Col>
                              </FormGroup>

                              <FormGroup row>
                                  <Label for="price" sm={3}>
                                      Prix de la boisson
                                  </Label>
                                  <Col sm={9}>
                                      <Input
                                          invalid={vPrice}
                                          value={price}
                                          onChange={handleChange}
                                          type="number"
                                          name="price"
                                          id="price"
                                          placeholder="0.000 FCFA"/>
                                  </Col>
                              </FormGroup>

                              <FormGroup>
                                  <Input
                                      value={id}
                                      onChange={handleChange}
                                      type="hidden"
                                      name="id"
                                      id="id" />
                                  <Input
                                      value={adminid}
                                      onChange={handleChange}
                                      type="hidden"
                                      name="adminid"
                                      id="adminid" />
                              </FormGroup>

                              {/* <FormGroup row>
                    <Col sm={3}>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          dropup={true}
                          caret
                          color="success"
                        >
                          Suggestions
                        </DropdownToggle>

                        <DropdownMenu>

                          <DropdownItem header>
                            <InputGroup size="sm" className="mt-1">
                              <InputGroupText style={{ color: "#ccc", backgroundColor: "#eee", borderColor: "#eee" }}>
                                  <FontAwesomeIcon style={{ cursor : "pointer" }} icon={faSearch} />
                                </InputGroupText>
                              <Input
                                type={"text"}
                                name="search"
                                id="suggest"
                                style={{ backgroundColor: "#eee", borderColor: "#eee" }}
                                bsSize="sm"
                                placeholder="Suggestions"
                                />
                                <InputGroupText style={{ color: "red", backgroundColor: "#eee", borderColor: "#eee" }}>
                                  <FontAwesomeIcon style={{ cursor : "pointer" }} icon={faTimes} />
                                </InputGroupText>
                            </InputGroup>
                          </DropdownItem>

                          <div className='px-3'>
                            <SimpleGrid columns={2}>
                                {['sm', 'sm',].map((size) => (
                                  <Tag
                                    size={size}
                                    key={size}
                                    className='py-1'
                                    borderRadius='full'
                                    variant='solid'
                                    colorScheme='white.100'
                                  >
                                    <TagLabel color={'black'}>Pepsi</TagLabel>
                                    <TagCloseButton color={'red'} />
                                  </Tag>
                                ))}
                            </SimpleGrid>
                          </div>

                          <DropdownItem divider />

                          <DropdownItem>
                            <Row style={{ minWidth: "100%" }}>
                              <Col sm={4}>
                                <Avatar
                                      src='https://pbs.twimg.com/profile_images/1255241280856227841/Pcm8Xpj4_400x400.jpg'
                                      size='md'
                                      name='Segun Adebayo'
                                      ml={-1}
                                      mr={2}
                                    />
                              </Col>
                              <Col sm={6}>
                                <Row><b>Pepsi</b></Row>
                                <Row><b className='wazieats-color'>800 FCFA</b></Row>
                              </Col>
                              <Col sm={2} className="justify-content-center align-self-center">
                                <Checkbox defaultChecked></Checkbox>
                              </Col>
                            </Row>
                          </DropdownItem>
                          <DropdownItem>
                            <Row style={{ minWidth: "100%" }}>
                              <Col sm={4}>
                                <Avatar
                                      src='https://pbs.twimg.com/profile_images/1255241280856227841/Pcm8Xpj4_400x400.jpg'
                                      size='md'
                                      name='Segun Adebayo'
                                      ml={-1}
                                      mr={2}
                                    />
                              </Col>
                              <Col sm={6}>
                                <Row><b>Pepsi</b></Row>
                                <Row><b className='wazieats-color'>800 FCFA</b></Row>
                              </Col>
                              <Col sm={2} className="justify-content-center align-self-center">
                                <Checkbox></Checkbox>
                              </Col>
                            </Row>
                          </DropdownItem>
                          <DropdownItem>
                            <Row style={{ minWidth: "100%" }}>
                              <Col sm={4}>
                                <Avatar
                                      src='https://pbs.twimg.com/profile_images/1255241280856227841/Pcm8Xpj4_400x400.jpg'
                                      size='md'
                                      name='Segun Adebayo'
                                      ml={-1}
                                      mr={2}
                                    />
                              </Col>
                              <Col sm={6}>
                                <Row><b>Pepsi</b></Row>
                                <Row><b className='wazieats-color'>800 FCFA</b></Row>
                              </Col>
                              <Col sm={2} className="justify-content-center align-self-center">
                                <Checkbox></Checkbox>
                              </Col>
                            </Row>
                          </DropdownItem>
                          <DropdownItem>
                            <Row style={{ minWidth: "100%" }}>
                              <Col sm={4}>
                                <Avatar
                                      src='https://pbs.twimg.com/profile_images/1255241280856227841/Pcm8Xpj4_400x400.jpg'
                                      size='md'
                                      name='Segun Adebayo'
                                      ml={-1}
                                      mr={2}
                                    />
                              </Col>
                              <Col sm={6}>
                                <Row><b>Pepsi</b></Row>
                                <Row><b className='wazieats-color'>800 FCFA</b></Row>
                              </Col>
                              <Col sm={2} className="justify-content-center align-self-center">
                                <Checkbox></Checkbox>
                              </Col>
                            </Row>
                          </DropdownItem>


                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </Col>
                  </FormGroup> */}

                              <FormGroup check row className='mt-5'>
                                  <Col sm={{ size: 2, offset: 10 }}>
                                      <Button block className="wazi-btn">{ id === 0 ? "Ajouter" : "Mettre à jour"}</Button>
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
              <Col key={`drink-${item.id}`} md="12" lg="6" xl="3">
                <Card className="wazi-card-item card-shadow-primary card-border text-white mb-3  product-bg">
                  <CardHeader style={{ border: "none" }}>
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
                  <Item name={item.name} price={item.price} image={item.drinkPicture ? item.drinkPicture : item.admin_drink.drinkPicture} />
                  <div className='item-detail'>
                    <h5 style={{ position: "absolute", bottom: "30px", left: "25%" }}>Détails de la boisson</h5>
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

export default Drinks