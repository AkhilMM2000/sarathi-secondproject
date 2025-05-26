import { useState, useEffect } from 'react';
import { DriverAPI, UserAPI } from '../Api/AxiosInterceptor';
import { DriverData, IUser } from '../constant/types';

interface ChatUserData {
  id: string;
  name: string;
  profile: string;
  email: string;
  onlineStatus: 'online' | 'offline';
  lastSeen: Date;
}

const useFetchChatUserData = (senderType: 'user' | 'driver', receiverId: string) => {
  const [userData, setUserData] = useState<ChatUserData | null>(null);
  const [apiError, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let response;
        if (senderType === 'user') {
          response = await UserAPI.get(`/driver/${receiverId}`);
          const driver: DriverData = response.data.driver;
          setUserData({
            id: driver._id,
            name: driver.name,
            profile: driver.profileImage,
            email: driver.email,
            lastSeen: driver.lastSeen,
            onlineStatus: driver.onlineStatus,
          });
        } else if (senderType === 'driver') {
          response = await DriverAPI.get(`/user/${receiverId}`);
          const user: IUser = response.data.user;
          setUserData({
            id: user._id,
            name: user.name,
            profile: user.profile,
            email: user.email,
            lastSeen: user.lastSeen,
            onlineStatus: user.onlineStatus,
          });
        }
      } catch (err) {
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    if (receiverId) {
      fetchData();
    }
  }, [senderType, receiverId]);

  return { userData, apiError, loading };
};

export default useFetchChatUserData;
