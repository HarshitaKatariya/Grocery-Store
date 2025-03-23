import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";

function Profile() {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    id: localStorage.getItem("id"),
  };

  const [profile, setProfile] = useState<any>(null); // Default value as null
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1000/api/v1/user/profile",
          { headers }
        );
        setProfile(response.data.user.user);
      } catch (error: any) {
        console.error("Error fetching profile:", error.response?.data || error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        profile && (
          <div className="flex flex-col lg:flex-row flex-grow">
            {/* Sidebar */}
            <div className="w-full lg:w-1/4 bg-gray-200 p-4">
              <Sidebar data={profile} />
            </div>

            {/* Main Content */}
            <div className="w-full lg:w-3/4 p-4">
              <Outlet />
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default Profile;
