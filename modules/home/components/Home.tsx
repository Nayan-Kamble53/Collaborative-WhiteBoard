import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { socket } from "@/common/lib/socket";
import { useSetRoomId } from "@/common/recoil/session";

import logo from './logo.png'

const Home = () => {
  const setAtomRoomId = useSetRoomId();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const router = useRouter();

  useEffect(() => {
    document.body.style.backgroundColor = "white";
  }, []);

  useEffect(() => {
    socket.on("created", (roomIdFromServer) => {
      setAtomRoomId(roomIdFromServer);
      router.push(roomIdFromServer);
    });
  }, []);

  useEffect(() => {
    socket.emit("leave_room");
    setAtomRoomId("");
  }, [setAtomRoomId]);

  const handleCreateRoom = () => {
    socket.emit("create_room", username);
  };

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if(roomId) 
      socket.emit("join_room", roomId, username);
  };

  const handleRedirect = () => {
    if (roomId.trim() !== '') {
      router.push(roomId);
    }
  };

  return (
    <div className="home flex flex-col items-center h-full bg-richblack-900 text-richblack-100 w-screen overflow-hidden">
      <img src={logo.src} alt="logo" width={500}/>
      <div className="flex flex-col items-center justify-center shadow-lg shadow-slate-500 rounded px-8 pt-6 pb-8 mb-4 
      w-100 mt-5 box">
        <h3 className="text-richblack-5 font-semibold text-[1.6rem] rtw">Real-time Whiteboard</h3>
        
        <form
          className="flex flex-col gap-3 inputDiv items-center"
          onSubmit={handleJoinRoom}
        >
        <div className="mt-7 flex flex-col gap-2 inputDiv">
          <label className="text-lg text-richblack-5 mb-1 mx-3 label">
            Enter your name <sup className="text-pink-200">*</sup>
          </label>
          <input
            className="input bg-richblack-800 rounded-[0.75rem] w-[25vw] p-[9px] mx-5 text-richblack-5"
            id="roomid"
            placeholder="Username..."
            value={username}
            onChange={(e) => setUsername(e.target.value.slice(0, 15))}
          />
        </div>
          
        <div className="mt-3 flex flex-col gap-2 inputDiv">
          <label htmlFor="room-id" className="text-lg text-richblack-5 mb-1 mx-3 label">
            Enter session id 
          </label>
          <input
            className="input bg-richblack-800 rounded-[0.75rem] w-[25vw] p-[9px] mx-5 text-richblack-5"
            type="text"
            id="room-id"
            placeholder="Session id..."
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
        </div>
          <button className="btn w-32" onClick={handleRedirect}>
            Join
          </button>
        </form>

        <div className="my-8 flex w-full items-center gap-2">
          <div className="h-px w-1/2  bg-zinc-200" />
          <p className="text-zinc-400">or</p>
          <div className="h-px w-1/2 bg-zinc-200" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <h5 className="text-lg text-richblack-5 mb-1">Create new session</h5>

          <button className="btn w-32" onClick={handleCreateRoom}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;