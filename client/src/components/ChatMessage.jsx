import { useEffect, useRef, useState } from "react";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const localAdd = "http://localhost:3000";

const ChatMessage = ({ msg, isOwn, isGroupChat = false, onAvatarClick = () => {}, onDelete = () => {} }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatar = msg.sender.avatar
    ? localAdd + msg.sender.avatar.replace("public", "")
    : "https://i.pinimg.com/736x/dc/9c/61/dc9c614e3007080a5aff36aebb949474.jpg";

  const isDeleted = msg.isDeleted;
  const hasText = msg.content?.trim();
  const hasMedia = msg.type !== "text";

  const seenByOthers = (msg.seenBy || []).filter((u) => u._id !== msg.sender._id);
  const seenDisplay = () => {
    if (!isGroupChat) return "Seen";
    const names = seenByOthers.map((u) => u.username);
    const displayNames = names.slice(0, 2).join(", ");
    const more = names.length > 2 ? ` + ${names.length - 2} more` : "";
    return `Seen by ${displayNames}${more}`;
  };

  const renderMedia = () => {
    switch (msg.type) {
      case "audio": return <MessageAudio fileUrl={msg.fileUrl} />;
      case "image": return <MessageImage fileUrl={msg.fileUrl} />;
      case "video": return <MessageVideo fileUrl={msg.fileUrl} />;
      case "file": return <MessageFile fileUrl={msg.fileUrl} fileName={msg.content} />;
      default: return null;
    }
  };

  return (
    <div className={`flex gap-2 mb-2 ${isOwn ? "justify-end" : "justify-start"} relative`}>
      {!isOwn && (
        <img src={avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover mt-auto" />
      )}

      <div className="flex flex-col max-w-[90%]">
        {isGroupChat && !isOwn && !isDeleted && (
          <span onClick={() => onAvatarClick(msg.sender)} className="text-xs text-pink-400 font-semibold mb-1 cursor-pointer">
            {msg.sender?.username}
          </span>
        )}

        <div
          className={`relative inline-block px-4 py-2 rounded-lg text-sm break-words whitespace-pre-wrap ${
            isOwn ? "bg-[#1A2130] text-[#ff3c87]" : "bg-[#24272E] text-white"
          }`}
        >
          {isOwn && !isDeleted && (
            <button
              ref={buttonRef}
              onClick={() => setShowMenu((prev) => !prev)}
              className="absolute top-1 right-1 text-xs text-gray-400 hover:text-white"
            >
              ⋮
            </button>
          )}

          {isDeleted ? (
            <div className="italic text-gray-400">You deleted this message</div>
          ) : (
            <>
              {hasMedia && <div className="mb-1">{renderMedia()}</div>}
              {hasText && <MessageText content={msg.content} />}
            </>
          )}

         <AnimatePresence>
  {showMenu && (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute top-6 right-2 bg-[#2b2f40] border border-gray-700 rounded-md shadow-lg z-50 w-32 overflow-hidden"
    >
      <button
        onClick={() => {
          if (msg.content) {
            navigator.clipboard.writeText(msg.content).then(() => {
              setShowMenu(false);
            });
          }
        }}
        className="px-4 py-2 w-full text-left text-sm text-white hover:bg-gray-600 transition"
      >
        Copy
      </button>
      <button
        onClick={(e) => {
          onDelete(e, msg._id);
          setShowMenu(false);
        }}
        className="text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 w-full text-left text-sm transition"
      >
        Delete
      </button>
    </motion.div>
  )}
</AnimatePresence>

        </div>

        {!isDeleted && isOwn && (
          <div className="mt-1 text-xs text-right text-gray-400 px-1">
            {msg.status === "sending" && <span>Sending...</span>}
            {msg.status === "failed" && <span className="text-red-500">Failed</span>}
            {msg.status === "sent" && msg.seenBy?.length <= 1 && <span>Sent</span>}
            {msg.seenBy?.length > 1 && <span>{seenDisplay()}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;


// ✅ Subcomponents

export const MessageText = ({ content }) => (
  <div className="whitespace-pre-wrap">{content}</div>
);

export const MessageImage = ({ fileUrl }) => {
  const src = localAdd.concat(fileUrl.replace("public", ""));
  return (
    <div className="relative group rounded-md overflow-hidden">
      <img src={src} alt="Sent" className="w-full rounded-md" />
      <a
        href={src}
        download
        className="absolute bottom-2 right-2 bg-black/60 p-1 rounded-full text-white text-sm opacity-0 group-hover:opacity-100 transition"
      >
        <IoCloudDownloadOutline />
      </a>
    </div>
  );
};

export const MessageAudio = ({ fileUrl }) => {
  const src = localAdd.concat(fileUrl.replace("public", ""));
  return (
    <div className="relative group">
      <audio controls className="w-full mt-2" src={src} />
      <a
        href={src}
        download
        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition bg-black/60 p-1 rounded-full text-white text-sm"
      >
        <IoCloudDownloadOutline />
      </a>
    </div>
  );
};

export const MessageVideo = ({ fileUrl }) => {
  const src = localAdd.concat(fileUrl.replace("public", ""));
  return (
    <div className="relative group">
      <video controls className="w-full rounded-md" src={src} />
      <a
        href={src}
        download
        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition bg-black/60 p-1 rounded-full text-white text-sm"
      >
        <IoCloudDownloadOutline />
      </a>
    </div>
  );
};

export const MessageFile = ({ fileUrl, fileName }) => {
  const src = localAdd.concat(fileUrl.replace("public", ""));
  return (
    <div className="flex items-center justify-between bg-[#202A42] px-3 py-2 rounded-md text-sm text-white group">
      <div className="truncate flex gap-2 items-center">
        <span className="text-lg">📎</span>
        <span className="truncate">{fileName || 'Download File'}</span>
      </div>
      <a
        href={src}
        download
        className="text-pink-400 hover:text-pink-500 opacity-0 group-hover:opacity-100 transition"
      >
        <IoCloudDownloadOutline />
      </a>
    </div>
  );
};
