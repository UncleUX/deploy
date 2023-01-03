export default function Drink (props) {
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
            <h6 className="menu-header-subtitle">
            { new Intl.NumberFormat().format(props.price) } Fcfa
            </h6>
          </div>
        </div>
      </div>
    </div>
  )
}
