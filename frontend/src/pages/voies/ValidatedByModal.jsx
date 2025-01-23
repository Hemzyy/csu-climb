import React from "react";
import { Link } from "react-router-dom";

const ValidatedByModal = ({ validatedUsers, closeModal }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#535353] text-white rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto p-4 relative">
        <button
          className="absolute top-2 right-2 text-white text-2xl"
          onClick={closeModal}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Validated By</h2>
        <div className="space-y-2">
          {validatedUsers.map((user) => (
            <Link 
                to={`/profile/${user?.username}`}
                key={user._id} 
              >
              <div
                //key={user._id}
                className="flex items-center gap-2 border-b border-gray-500 py-2"
              >
                <img
                  src={user.profileImg || "/avatar-placeholder.png"}
                  alt={user.username}
                  className="w-8 h-8 rounded-full"
                />
                <p className="text-sm">{user.username}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ValidatedByModal;
