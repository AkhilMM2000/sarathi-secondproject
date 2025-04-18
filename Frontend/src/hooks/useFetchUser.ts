import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../store/slices/AuthuserStore"; // Adjust path
import { getLoggedUserApi } from "../Api/userService"; // Adjust path
import { AppDispatch, RootState} from "../store/ReduxStore";

const useFetchUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.authUser.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getLoggedUserApi();
        console.log("Fetched user:", user);

        dispatch(setAuthUser(user)); // Store in Redux
      } catch (error) {
        console.error("Failed to fetch logged user:", error);
      }
    };

    if (!currentUser) {
      fetchUser(); // Fetch only if user is not already in Redux
    }
  }, [dispatch, currentUser]);

  return currentUser;
};

export default useFetchUser;
