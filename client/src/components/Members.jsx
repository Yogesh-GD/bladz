import { toast } from "react-toastify";
import { useRemoveGroupMemberMutation } from "../features/chat/chatApi";
import { useState } from "react";

const Members = ({ members, adminId, authUserId, groupId }) => {
  const [removeMember] = useRemoveGroupMemberMutation();
  const [removingId, setRemovingId] = useState(null); 

  const handleRemoveUser = async (memberId) => {
    setRemovingId(memberId);
    try {
      await removeMember({ groupId, memberId }).unwrap();
      toast.success("Member removed successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to remove member");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="p-4 max-w-md w-full bg-[#1A2130] rounded-lg text-white">
      <h3 className="text-lg font-semibold mb-4">Group Members</h3>
      <ul className="space-y-3 max-h-96 overflow-y-auto">
        {members.map((user) => {
          const isAdmin = user._id === adminId;
          const isAuthUserAdmin = authUserId === adminId;
          const canRemove = isAuthUserAdmin && !isAdmin;
          const isRemoving = removingId === user._id;

          return (
            <li
              key={user._id}
              className="flex items-center justify-between p-2 rounded hover:bg-[#2a2f45]"
            >
              <div className="flex items-center gap-3">
                <img
                  src={
                    user.avatar ||
                    "https://i.pinimg.com/736x/dc/9c/61/dc9c614e3007080a5aff36aebb949474.jpg"
                  }
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{user.username}</p>
                  {isAdmin && (
                    <span className="text-xs text-[#FF3C87] font-semibold">
                      Admin
                    </span>
                  )}
                </div>
              </div>

              {canRemove && (
                <button
                  onClick={() => handleRemoveUser(user._id)}
                  className="text-sm text-red-500 hover:text-red-600 font-semibold"
                  disabled={isRemoving}
                >
                  {isRemoving ? "Removing..." : "Remove"}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Members;
