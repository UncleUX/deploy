import { Button } from "reactstrap"

export default function Item (props) {
  return (
    <div className="dropdown-menu-header">
      <div className="dropdown-menu-header-inner">
        <div className="menu-header-content">
          <div className="avatar-icon-wrapper mb-3 avatar-icon-xl">
            <div className="avatar-icon">
              <img src={props.image} alt="Avatar 5" />
            </div>
          </div>
          <div className='text-muted'>
            <h5 className="menu-header-title">{props.name}</h5>
          </div>
          <div className="mt-2 px-3">
            <Button size="sm" className="wazi-btn fw-bold text-light" block>{ new Intl.NumberFormat().format(props.price) } Fcfa</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
