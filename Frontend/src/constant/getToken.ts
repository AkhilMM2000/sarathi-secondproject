

export const getAccessToken = (): string | null => {
    const userToken = localStorage.getItem("user_accessToken");
    const driverToken = localStorage.getItem("driver_accessToken");
   
    if (userToken) return userToken;
    if (driverToken) return driverToken;
    return null;
  };
  