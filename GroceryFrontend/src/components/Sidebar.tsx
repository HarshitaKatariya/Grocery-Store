import { NavLink, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { authActions } from "../store/auth";
import { useDispatch, useSelector } from "react-redux";

const Sidebar = ({
 
  data,
}: {
  data: { avatar: string; username: string; email: string; address: string } | null;
}) => {
  if (!data) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  const history = useNavigate();
  const dispatch = useDispatch();
  const role = useSelector((state:any) => state.auth.role);

  return (
    <div className="bg-slate-100 lg:h-full h-auto p-4 lg:p-6 rounded-lg shadow-lg flex flex-col items-center text-center space-y-6">
      {/* Avatar */}
      <div className="py-4">
        <img
          src={data.avatar}
          alt="User Avatar"
          className="h-24 w-24 rounded-full object-cover border-4 border-gray-300 shadow-md"
        />
      </div>

      {/* User Info */}
      <div>
        <p className="text-lg font-semibold text-zinc-700">{data.username}</p>
        <p className="text-sm text-zinc-500">{data.email}</p>
        <p className="text-sm text-zinc-500">{data.address}</p>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-gray-300"></div>

      {/* Navigation Links */}
      <div className="w-full flex flex-col space-y-4">
        {role === "user" && (<>
          <NavLink
          to="/profile"
          className={({ isActive }) =>
            `text-base font-medium py-2 rounded-lg text-center ${
              isActive
                ? "bg-green-100 text-green-700"
                : "text-gray-700 hover:text-green-700 hover:bg-green-50"
            }`
          }
        >
          Order History
        </NavLink>
        <NavLink
          to="settings"
          className={({ isActive }) =>
            `text-base font-medium py-2 rounded-lg text-center ${
              isActive
                ? "bg-green-100 text-green-700"
                : "text-gray-700 hover:text-green-700 hover:bg-green-50"
            }`
          }
        >
          Settings
        </NavLink>
        </>)}
        {role === "admin" && (<>
          <NavLink
          to="/profile"
          className={({ isActive }) =>
            `text-base font-medium py-2 rounded-lg text-center ${
              isActive
                ? "bg-green-100 text-green-700"
                : "text-gray-700 hover:text-green-700 hover:bg-green-50"
            }`
          }
        >
         All Orders
        </NavLink>
        <NavLink
          to="additem"
          className={({ isActive }) =>
            `text-base font-medium py-2 rounded-lg text-center ${
              isActive
                ? "bg-green-100 text-green-700"
                : "text-gray-700 hover:text-green-700 hover:bg-green-50"
            }`
          }
        >
          Add Item
        </NavLink>
        </>)}
        <button
          onClick={() => {
            dispatch(authActions.logout());
            dispatch(authActions.changeRole('user'));
            localStorage.clear();
            history('/');
          }}
          className="text-white bg-green-600 px-3 py-2 rounded-md text-sm hover:bg-green-700"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
