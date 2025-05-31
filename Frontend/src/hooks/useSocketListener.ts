// src/hooks/useSocketListener.ts
import {  useEffect, useState } from "react";
import { CreatesocketConnection } from "../constant/socket"; 


import { RootState } from "../store/ReduxStore";
import { useSelector } from "react-redux";
import moment from "moment";


export const useSocketListener = () => {
  const [message, setMessage] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const userData = useSelector((state: RootState) => state.authUser.user);

  useEffect(() => {
    if(!userData?._id) return;

    const socket = CreatesocketConnection();

    if (userData?._id) {
      socket.emit("user:online", {userId:userData?._id});
    }

    socket.on("booking:confirmation", ({status,startDate}) => {
          const formattedDate = moment(startDate).format("MMMM D, dddd");
    console.log("Booking confirmation reach here okay:",status,startDate);
      setMessage(`Booking ${status} for a ride in ${formattedDate}`);
      setOpen(true);
    });

    socket.on("booking:reject", ({status,startDate,reason}) => {
      const formattedDate = moment(startDate).format("MMMM D, dddd");
console.log("Booking confirmation reach here okay:",status,startDate);
  setMessage(`Booking ${status} for a ride in ${formattedDate} due to ${reason}`);
  setOpen(true);
});


    return () => {
      socket.off("bookingStatus");
    };
  }, [userData]);

  return { message, open, setOpen};
};
