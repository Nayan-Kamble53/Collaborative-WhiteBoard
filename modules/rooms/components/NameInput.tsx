import { FormEvent, useEffect, useState } from "react";

import { useRouter } from "next/router";

import { socket } from "@/common/lib/socket";
import { useModal } from "@/common/recoil/modal2";
import { useSetRoomId } from "@/common/recoil/session";
import NotFoundModal from "@/modules/home/modals/NotFound";
import logo from '../../../modules/home/components/logo.png';

const NameInput = () => {
  const setRoomId = useSetRoomId();
  const { openModal } = useModal();

  const [name, setName] = useState("");

  const router = useRouter();
  const roomId = (router.query.roomId || "").toString();

  useEffect(() => {
    if (!roomId) return;

    socket.emit("check_room", roomId);

    socket.on("room_exists", (exists) => {
      if (!exists) {
        router.push("/");
      }
    });

    // eslint-disable-next-line consistent-return
    return () => {
      socket.off("room_exists");
    };
  }, [roomId, router]);

  useEffect(() => {
    const handleJoined = (roomIdFromServer: string, failed?: boolean) => {
      if (failed) {
        router.push("/");
        openModal(<NotFoundModal id={roomIdFromServer} />);
      } else setRoomId(roomIdFromServer);
    };

    socket.on("joined", handleJoined);

    return () => {
      socket.off("joined", handleJoined);
    };
  }, [openModal, router, setRoomId]);

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket.emit("join_room", roomId, name);
  };

  return (
    <form
      className="sessionDiv flex flex-col items-center justify-between h-screen w-screen bg-richblack-900 text-richblack-25 pt-7"
      onSubmit={handleJoinRoom}
    >
      <img src={logo.src} alt="logo" width={500}/>  

      <div className="session flex flex-col items-center justify-center shadow-lg shadow-slate-500 rounded px-8 pt-6 pb-8 mb-4 w-[30vw] h-[22vw] box ml-10">
        <h3 className="text-richblack-5 font-semibold text-[1.6rem] rtw">Real-Time Whiteboard</h3>

        <div className="mt-10 mb-3 flex flex-col gap-2">
          <label className="text-md text-richblack-5 mb-1 label">
            Enter your name <sup className="text-pink-200">*</sup>
          </label>
          <input
            className="inputDiv bg-richblack-800 rounded-[0.75rem] w-[25vw] p-[9px]  text-richblack-5"
            id="room-id"
            placeholder="Username..."
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 15))}
          />
        </div>  

        <button className="btn mt-4 h-10" type="submit">
          Enter session
        </button>
      </div>
      
      <div className="footer bg-richblack-800 w-screen flex items-center justify-center h-[5vw]">
        Made with ❤️ by Nayan K. &#169; 2024 CollaboraDraw Real-Time Whiteboard !
      </div>
    </form>
  );
};

export default NameInput;