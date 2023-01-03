import { Fragment, useState } from "react"
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import classnames from "classnames";
import { IoIosAnalytics } from "react-icons/io";
import {
  Row,
  Col,
  Button,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Card,
  CardBody,
  ButtonGroup,
  TabContent,
  TabPane,
  Container,
  Input
} from "reactstrap";


import {
  XAxis,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

import PerfectScrollbar from "react-perfect-scrollbar";

import {
  faAngleUp,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CountUp from "react-countup";

import food1 from "../../assets/utils/images/food/food_1.jpg";
import food2 from "../../assets/utils/images/food/food_2.jpg";
import food3 from "../../assets/utils/images/food/food_3.jpg";
import food4 from "../../assets/utils/images/food/food_4.jpg";
import food5 from "../../assets/utils/images/food/food_5.jpg";
import food6 from "../../assets/utils/images/food/food_6.jpg";
import food7 from "../../assets/utils/images/food/food_7.jpg";

import drink1 from "../../assets/utils/images/drink/drink_1.jpg";
import drink2 from "../../assets/utils/images/drink/drink_2.jpg";
import drink3 from "../../assets/utils/images/drink/drink_3.jpg";
import drink4 from "../../assets/utils/images/drink/drink_4.jpg";
import drink5 from "../../assets/utils/images/drink/drink_5.jpg";
import drink6 from "../../assets/utils/images/drink/drink_6.jpg";

const foodDaily = [
  {
    name: 'Ndolé',
    price: 3500,
    total: 227000,
    image: food1
  },
  {
    name: 'Poulet DG',
    price: 2500,
    total: 129000,
    image: food2
  }
]

const foodWeekly = [
  {
    name: 'Ndolé',
    price: 3500,
    total: 227000,
    image: food1
  },
  {
    name: 'Poulet DG',
    price: 2500,
    total: 129000,
    image: food2
  },
  {
    name: 'Eru',
    price: 2500,
    total: 4620000,
    image: food6
  },{
    name: 'Nkôno Ngond',
    price: 3500,
    total: 9560000,
    image: food7
  }
]

const foodMonthly = [
  {
    name: 'Ndolé',
    price: 3500,
    total: 227000,
    image: food1
  },
  {
    name: 'Poulet DG',
    price: 2500,
    total: 129000,
    image: food2
  },
  {
    name: 'Kondrè',
    price: 2500,
    total: 629000,
    image: food5
  }
  ,{
    name: 'Eru',
    price: 2500,
    total: 4620000,
    image: food6
  }
  ,{
    name: 'Nkôno Ngond',
    price: 3500,
    total: 9560000,
    image: food7
  }
]

const foodYearly = [
  {
    name: 'Ndolé',
    price: 3500,
    total: 227000,
    image: food1
  },
  {
    name: 'Poulet DG',
    price: 2500,
    total: 129000,
    image: food2
  },
  {
    name: 'Poisson braisé',
    price: 2500,
    total: 4529000,
    image: food3
  },
  {
    name: 'Koki',
    price: 1500,
    total: 65300,
    image: food4
  },
  {
    name: 'Kondrè',
    price: 2500,
    total: 629000,
    image: food5
  }
  ,{
    name: 'Eru',
    price: 2500,
    total: 4620000,
    image: food6
  }
  ,{
    name: 'Nkôno Ngond',
    price: 3500,
    total: 9560000,
    image: food7
  }
]

const drinkDayly = [
  {
    name: 'Chill',
    price: 2500,
    total: 4620000,
    image: drink6
  },
  {
    name: 'Sprite',
    price: 3500,
    total: 9560000,
    image: drink6
  }
]

const drinkWeekly = [
  {
    name: 'Pepsi',
    price: 1500,
    total: 227000,
    image: drink1
  },
  {
    name: 'Coca Cola',
    price: 1000,
    total: 129000,
    image: drink2
  },
  {
    name: 'Djino',
    price: 2500,
    total: 4529000,
    image: drink3
  }
]

const drinkMonthly = [
  {
    name: 'Castel',
    price: 1500,
    total: 65300,
    image: drink4
  },
  {
    name: 'Orangina',
    price: 2500,
    total: 629000,
    image: drink5
  }
  ,{
    name: 'Chill',
    price: 2500,
    total: 4620000,
    image: drink6
  }
  ,{
    name: 'Sprite',
    price: 3500,
    total: 9560000,
    image: drink6
  }
]

const drinkYearly = [
  {
    name: 'Pepsi',
    price: 1500,
    total: 227000,
    image: drink1
  },
  {
    name: 'Coca Cola',
    price: 1000,
    total: 129000,
    image: drink2
  },
  {
    name: 'Djino',
    price: 2500,
    total: 4529000,
    image: drink3
  },
  {
    name: 'Castel',
    price: 1500,
    total: 65300,
    image: drink4
  },
  {
    name: 'Orangina',
    price: 2500,
    total: 629000,
    image: drink5
  }
  ,{
    name: 'Chill',
    price: 2500,
    total: 4620000,
    image: drink6
  }
  ,{
    name: 'Sprite',
    price: 3500,
    total: 9560000,
    image: drink6
  }
]

const data2 = [
  { name: "Jan", Sales: 4000, Downloads: 2400, amt: 2400 },
  { name: "Feb", Sales: 3000, Downloads: 1398, amt: 2210 },
  { name: "Mar", Sales: 2000, Downloads: 5800, amt: 2290 },
  { name: "Apr", Sales: 2780, Downloads: 3908, amt: 2000 },
  { name: "Jun", Sales: 1890, Downloads: 4800, amt: 2181 },
  { name: "Jul", Sales: 2390, Downloads: 3800, amt: 2500 },
  { name: "Aug", Sales: 3490, Downloads: 4543, amt: 1233 },
  { name: "Sep", Sales: 1256, Downloads: 1398, amt: 1234 },
  { name: "Oct", Sales: 2345, Downloads: 4300, amt: 5432 },
  { name: "Nov", Sales: 1258, Downloads: 3908, amt: 2345 },
  { name: "Dec", Sales: 3267, Downloads: 2400, amt: 5431 },
];

const dataDayly = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Page F", uv: 1390, pv: 3800, amt: 1500 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
]

const dataWeekly = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Page F", uv: 1390, pv: 3800, amt: 1500 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
  { name: "Page E", uv: 2890, pv: 9800, amt: 2181 },
  { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
];

const dataMonthly = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Page F", uv: 1390, pv: 3800, amt: 1500 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
  { name: "Page E", uv: 2890, pv: 9800, amt: 2181 },
  { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
];

const dataYearly = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Page F", uv: 1390, pv: 3800, amt: 1500 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
  { name: "Page E", uv: 2890, pv: 9800, amt: 2181 },
  { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
  { name: "Page C", uv: 2000, pv: 6800, amt: 2290 },
  { name: "Page D", uv: 4780, pv: 7908, amt: 2000 },
];

export default function Content() {

  const [ activeTab, setActiveTab ] = useState('1')
  const [ period, setPeriod ] = useState("dayly")

  const toggle = (tab) => {
    if(activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  const foods = (period === 'weekly') ? foodWeekly : (period === 'monthly' ? foodMonthly : (period === 'yearly' ? foodYearly : foodDaily))
  const drinks = (period === 'weekly') ? drinkWeekly : (period === 'monthly' ? drinkMonthly : (period === 'yearly' ? drinkYearly : drinkDayly))
  const dataChart = (period === 'weekly') ? dataWeekly : (period === 'monthly' ? dataMonthly : (period === 'yearly' ? dataYearly : dataDayly))
  const periodText = (period === 'weekly') ? 'de la semaine' : (period === 'monthly' ? 'du mois' : (period === 'yearly' ? "de l'année" : "du jour"))

  const totalFood = foods.reduce(
		(acc, item) => acc + item.total,
		0
	)
  const totalDrink = drinks.reduce(
		(acc, item) => acc + item.total,
		0
	)

  return (
    <Fragment>
      <TransitionGroup>
        <CSSTransition component="div" classNames="TabsAnimation" appear={true}
          timeout={1500} enter={false} exit={false}>
          <div>
            <Container fluid className="pb-3">
              <Row >
                <Col lg={
                  {size: 4, offset:8}
                } xs="12">
                  <Input
                    id="period"
                    name="period"
                    type="select"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                  >
                    <option value="dayly">
                      Jour
                    </option>
                    <option value="weekly">
                      Semaine
                    </option>
                    <option value="monthly">
                      Mois
                    </option>
                    <option value="yearly">
                      Année
                    </option>
                  </Input>
                </Col>
              </Row>
            </Container>
            <Row>
              <Col lg="6" xl="4">
                <Card className="mb-3">
                  <CardHeader className="card-header-tab">
                    <div className="card-header-title font-size-lg text-capitalize fw-normal">
                      <i className="header-icon lnr-layers me-3 text-muted opacity-6"> {" "} </i>
                      Vente des plats
                    </div>
                  </CardHeader>
                  <div className="widget-chart widget-chart2 text-start p-0">
                    <div className="widget-chat-wrapper-outer">
                      <div className="widget-chart-content widget-chart-content-lg">
                        <div className="widget-chart-flex">
                          <div className="widget-title opacity-5 text-muted text-uppercase">
                            Vente des plats {periodText}
                          </div>
                        </div>
                        <div className="widget-numbers">
                          <div className="widget-chart-flex">
                            <div>
                              <span className="opacity-10 text-success pe-2">
                                <FontAwesomeIcon icon={faAngleUp} />
                              </span>
                              <CountUp start={0} end={9} separator="" decimals={0} decimal="" prefix="" duration="15"/>
                              <small className="opacity-5 ps-1">%</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="widget-chart-wrapper widget-chart-wrapper-lg opacity-10 m-0">
                        <ResponsiveContainer height="100%">
                          <AreaChart data={dataChart}
                            margin={{
                              top: -15,
                              right: 0,
                              left: 0,
                              bottom: 0,
                            }}>
                            <defs>
                              <linearGradient id="colorPv2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="10%" stopColor="#3ac47d" stopOpacity={0.7}/>
                                <stop offset="90%" stopColor="#3ac47d" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Area type="monotoneX" dataKey="uv" stroke="#3ac47d" strokeWidth="3"
                              fillOpacity={1} fill="url(#colorPv2)"/>
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  <CardBody className="pt-2 pb-0">
                    <h6 className="text-muted text-uppercase font-size-md opacity-9 mb-2 fw-normal">
                      Plats vendus
                    </h6>
                    <div className="scroll-area-md shadow-overflow">
                      <PerfectScrollbar>
                        <ListGroup className="rm-list-borders rm-list-borders-scroll" flush>
                          {foods.map((food, index) => (
                            <ListGroupItem key={`food-${index}`}>
                            <div className="widget-content p-0">
                              <div className="widget-content-wrapper">
                                <div className="widget-content-left me-3">
                                  <img width={38} className="wazi-img-list" src={food.image} alt=""/>
                                </div>
                                <div className="widget-content-left">
                                  <div className="widget-heading">
                                    { food.name }
                                  </div>
                                  <div className="widget-subheading mt-1 opacity-10">
                                    <div className="badge rounded-pill bg-dark">
                                    { new Intl.NumberFormat().format(food.price) } Fcfa
                                    </div>
                                  </div>
                                </div>
                                <div className="widget-content-right">
                                  <div className="fsize-1 text-focus">
                                    { new Intl.NumberFormat().format(food.total) } Fcfa
                                    <small className={(index % 2 === 0) ? "text-warning ps-2" : "text-danger ps-2"}>
                                      <FontAwesomeIcon icon={(index % 2 === 0) ? faAngleUp : faAngleDown} />
                                    </small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </ListGroupItem>
                          ))}
                        </ListGroup>
                      </PerfectScrollbar>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="4">
                <Card className="mb-3">
                  <CardHeader className="card-header-tab">
                    <div className="card-header-title font-size-lg text-capitalize fw-normal">
                      <i className="header-icon lnr-layers me-3 text-muted opacity-6"> {" "} </i>
                      Vente des boissons 
                    </div>
                  </CardHeader>
                  <div className="widget-chart widget-chart2 text-start p-0">
                    <div className="widget-chat-wrapper-outer">
                      <div className="widget-chart-content widget-chart-content-lg">
                        <div className="widget-chart-flex">
                          <div className="widget-title opacity-5 text-muted text-uppercase">
                            Vente des boissons {periodText}
                          </div>
                        </div>
                        <div className="widget-numbers">
                          <div className="widget-chart-flex">
                            <div>
                              <span className="opacity-10 text-success pe-2">
                                <FontAwesomeIcon icon={faAngleUp} />
                              </span>
                              <CountUp start={0} end={9} separator="" decimals={0} decimal="" prefix="" duration="15"/>
                              <small className="opacity-5 ps-1">%</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="widget-chart-wrapper widget-chart-wrapper-lg opacity-10 m-0">
                        <ResponsiveContainer height="100%">
                          <AreaChart data={dataChart}
                            margin={{
                              top: -15,
                              right: 0,
                              left: 0,
                              bottom: 0,
                            }}>
                            <defs>
                              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="10%" stopColor="#545cd8" stopOpacity={0.7}/>
                                <stop offset="90%" stopColor="#545cd8" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Area type="monotoneX" dataKey="uv" stroke="#545cd8"
                              strokeWidth="3" fillOpacity={1} fill="url(#colorPv)"/>
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  <CardBody className="pt-2 pb-0">
                    <h6 className="text-muted text-uppercase font-size-md opacity-9 mb-2 fw-normal">
                      Boissons vendues
                    </h6>
                    <div className="scroll-area-md shadow-overflow">
                      <PerfectScrollbar>
                        <ListGroup className="rm-list-borders rm-list-borders-scroll" flush>
                          {drinks.map((drink, index) => (
                            <ListGroupItem key={`drink-${index}`}>
                            <div className="widget-content p-0">
                              <div className="widget-content-wrapper">
                                <div className="widget-content-left me-3">
                                  <img width={38} className="wazi-img-list" src={drink.image} alt=""/>
                                </div>
                                <div className="widget-content-left">
                                  <div className="widget-heading">
                                    { drink.name }
                                  </div>
                                  <div className="widget-subheading mt-1 opacity-10">
                                    <div className="badge rounded-pill bg-dark">
                                    { new Intl.NumberFormat().format(drink.price) } Fcfa
                                    </div>
                                  </div>
                                </div>
                                <div className="widget-content-right">
                                  <div className="fsize-1 text-focus">
                                    { new Intl.NumberFormat().format(drink.total) } Fcfa
                                    <small className={(index % 2 === 0) ? "text-warning ps-2" : "text-danger ps-2"}>
                                      <FontAwesomeIcon icon={(index % 2 === 0) ? faAngleUp : faAngleDown} />
                                    </small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </ListGroupItem>
                          ))}
                        </ListGroup>
                      </PerfectScrollbar>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="12" xl="4">
                <Card className="mb-3">
                  <CardHeader className="card-header-tab">
                    <div className="card-header-title font-size-lg text-capitalize fw-normal">
                      <i className="header-icon pe-7s-cash me-3 text-muted opacity-6"> {" "} </i>
                      Synthèse des ventes
                    </div>
                  </CardHeader>
                  <Row>
                    <Col lg="6" xl="12">
                      <Card className="no-shadow rm-border bg-transparent widget-chart text-start">
                        <div className="widget-chart-content">
                          <div className="widget-subheading text-uppercase">Total des ventes de plat</div>
                          <div className="widget-numbers">
                            {new Intl.NumberFormat().format(totalFood)} Fcfa
                          </div>
                        </div>
                      </Card>
                    </Col>
                    <Col lg="6" xl="12">
                      <div className="card no-shadow rm-border bg-transparent widget-chart text-start mt-2">
                        <div className="widget-chart-content">
                          <div className="widget-subheading text-uppercase">Total des ventes de boissons</div>
                          <div className="widget-numbers">
                            {new Intl.NumberFormat().format(totalDrink)} Fcfa
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div className="text-center mx-auto mt-3">
                    <div>
                      <ButtonGroup size="sm">
                        <Button caret="true" color="primary"
                          className={
                            "btn-shadow ps-3 pe-3 " +
                            classnames({ active: activeTab === "1" })
                          }
                          onClick={() => {
                            toggle("1");
                          }}>
                          Income
                        </Button>
                        <Button color="primary"
                          className={
                            "btn-shadow pe-3 ps-3 " +
                            classnames({ active: activeTab === "2" })
                          }
                          onClick={() => {
                            toggle("2");
                          }}>
                          Expenses
                        </Button>
                      </ButtonGroup>
                    </div>
                  </div>
                  <CardBody>
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId="1">
                        <div className="text-center">
                          <h5 className="menu-header-title">Target Sales</h5>
                          <h6 className="menu-header-subtitle opacity-6">
                            Total performance for this month
                          </h6>
                        </div>
                        <ResponsiveContainer height={244}>
                          <BarChart data={data2}>
                            <XAxis dataKey="name" />
                            <Legend />
                            <Bar barGap="12" dataKey="Sales" stackId="a" fill="#30b1ff"/>
                            <Bar barGap="12" dataKey="Downloads" stackId="a" fill="#30b1ff" fillOpacity=".15"/>
                          </BarChart>
                        </ResponsiveContainer>
                      </TabPane>
                      <TabPane tabId="2">
                        <div className="text-center">
                          <h5 className="menu-header-title">Tabbed Content</h5>
                          <h6 className="menu-header-subtitle opacity-6">
                            Example of various options built with ArchitectUI
                          </h6>
                        </div>
                        <Card className="card-hover-shadow-2x widget-chart widget-chart2 bg-premium-dark text-start mt-3">
                          <div className="widget-chart-content text-white">
                            <div className="widget-chart-flex">
                              <div className="widget-title">Sales</div>
                              <div className="widget-subtitle opacity-7">
                                Monthly Goals
                              </div>
                            </div>
                            <div className="widget-chart-flex">
                              <div className="widget-numbers text-success">
                                <small>$</small>
                                <CountUp start={0} end={976} separator="" decimals={0} decimal="."
                                  prefix="" useEasing={false} suffix="" duration="10"/>
                                <small className="opacity-8 ps-2">
                                  <FontAwesomeIcon icon={faAngleUp} />
                                </small>
                              </div>
                              <div className="widget-description ms-auto opacity-7">
                                <FontAwesomeIcon icon={faAngleUp} />
                                <span className="ps-1">175%</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                        <div className="text-center mt-3">
                          <Button color="success" className="btn-pill btn-shadow btn-wide fsize-1" size="lg">
                            <span className="me-2 opacity-7">
                              {/* <Ionicon color="#ffffff" icon="ios-analytics-outline" beat={true}/> */}
                              <IoIosAnalytics color="#ffffff" />
                            </span>
                            <span className="me-1">View Complete Report</span>
                          </Button>
                        </div>
                      </TabPane>
                    </TabContent>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </Fragment>
  )
}