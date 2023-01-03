import Base from '../Base';
import PageTitle from "../../components/PageTitle";
import Content from './content'
import { useSelector } from 'react-redux';
import { isLoggedIn } from '../../utils/selectors';
import { Redirect } from 'react-router-dom';

function Dashboard() {

  const isConnected = useSelector(isLoggedIn)

  if (!isConnected) {
    return <Redirect to='/login'/>
  }
  return (
    <Base>
      <div className="app-inner-layout">
        <div className="app-inner-layout__header-boxed p-0">
          <div className="app-inner-layout__header text-dark bg-white mb-4 d-flex justify-content-between align-content-center">
            <h1 className='fs-3'>Tableau de bord</h1>
          </div>
        </div>
        <Content />
      </div>
    </Base>
  )
}

export default Dashboard