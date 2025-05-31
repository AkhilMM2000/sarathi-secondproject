// src/components/CallModal.tsx

import React from "react";
import { Dialog } from "@mui/material"; // Optional: Replace with custom modal if needed

type CallModalProps = {
  open: boolean;
  type: "incoming" | "outgoing";
  callerName: string;
  role: "user" | "driver"; // role of the caller
  onAccept: () => void;
  onReject: () => void;
};

const CallModal: React.FC<CallModalProps> = ({
  open,
  type,
  callerName,
  role,
  onAccept,
  onReject,
}) => {
 
  

  const displayName = `${role === "user" ? "User" : "Driver"} ${callerName}`;
  const isIncoming = type === "incoming";

  return (
    <Dialog open={open} onClose={onReject}>
      <div className="p-6 w-80 text-center space-y-6">
        <h2 className="text-xl font-semibold">
          {isIncoming ? `${displayName} is calling you...` : `Calling ${displayName}...`}
        </h2>

        <div className="flex justify-center gap-4">
          {isIncoming ? (
            <>
              <button
                onClick={onAccept}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Accept
              </button>
              <button
                onClick={onReject}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Reject
              </button>
            </>
          ) : (
            <button
              onClick={onReject}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          )}
        </div>

      
      </div>
    </Dialog>
  );
};

export default CallModal;
