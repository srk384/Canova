import { useEffect } from "react";
import { useAuthenticationMutation } from "../../utils/redux/api/AuthAPI";
import { Navigate } from "react-router-dom";
import LoadingFallback from "../common/LoadingFallback/LoadingFallback";
import { useDispatch } from "react-redux";
import { setUser } from "../../utils/redux/slices/userSlice";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const [authentication, { isLoading, isError, error }] =
    useAuthenticationMutation();

  useEffect(() => {
    async function verifyJWT() {
      const data = await authentication({
        action: "verify",
        post: "",
      }).unwrap();

      dispatch(setUser(data));

      if (error) console.log("jwt verifaction error: ", error.data.error);
    }

    verifyJWT();
  }, []);

  if (isLoading) return <LoadingFallback />;

  if (isError && !isLoading) return <Navigate to="/login" replace:true />;

  return children;
};

export default ProtectedRoute;
