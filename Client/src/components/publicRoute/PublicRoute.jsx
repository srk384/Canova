import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { useAuthenticationMutation } from "../../utils/redux/api/AuthAPI";
import { setUser } from "../../utils/redux/slices/userSlice";
import LoadingFallback from "../common/LoadingFallback/LoadingFallback";

const PublicRoute = ({ children }) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const [authentication, { isLoading, data, isError }] =
    useAuthenticationMutation();

  useEffect(() => {
    async function verifyJWT() {
      try {
        const data = await authentication({
          action: "verify",
          post: "",
        }).unwrap();

        dispatch(setUser(data));
      } catch (error) {
        console.log("jwt verifaction error: ", error.data.error);
      }
    }

    verifyJWT();
  }, []);

  
  if (isLoading && token) return <LoadingFallback />;
  
  if (data && !isError) return <Navigate to="/dashboard" replace:true />;
  
  return children;
};

export default PublicRoute;
