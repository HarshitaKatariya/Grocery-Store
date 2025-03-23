import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { NavLink } from 'react-router-dom'
const Brand = () => {
  return (
    <NavLink to='/' className='flex items-center space-x-3'>
          <FontAwesomeIcon icon={faCartShopping} className="text-green-500 text-3xl" />
          <span className="text-xl font-semibold text-gray-700">Sharmaji <br /> <span className='text-green-500'>Grocery</span></span>

    </NavLink>
  )
}

export default Brand
