"use client";

import React, { useState, useEffect } from "react"
import Notification from "./notification";
import { setData, fetchData } from "../data/notificationData"
import StageQueue from "./stageQueue";
import { generateInsights } from "../data/EmotionData";
//calling function for storing notifs

export default function DevPanel() {

    const [openNotif, setOpenNotif] = useState(false);
    const [openTimeline, setOpenTimeline] = useState(false);
    const [notification, setNotification] = useState({ Img: null, Header: "Hello", Body: "Test", Tag: "Donation" });
    return (
        <div className='bg-black w-fit h-fit min-w-[30%] m-[24px] p-[24px] rounded-[8px] flex flex-col gap-[24px]' draggable="true">
            <h1>Dev Panel </h1>
            <div className="flex flex-row justify-between">
                <p className='text-white'> Add Notification </p>
                <button onClick={() => { setOpenNotif(!openNotif) }}>
                    {openNotif === true ?
                        <p className='text-white hover:cursor-pointer hover:opacity-60 opacity-100'>close</p> :
                        <p className='text-white hover:cursor-pointer hover:opacity-60 opacity-100'>open</p>}
                </button>
            </div>
            <div className={`flex-col gap-[48px] overflow-hidden
                ${openNotif === true ? "max-w-[100vh] flex" : "max-h-0 hidden"}`}>
                <div className="flex flex-col gap-[12px]">
                    <Notification Header={notification.Header} Body={notification.Body} Img={notification.Img} />
                </div>
                <div className="flex flex-col gap-[16px]">
                    <div className="flex flex-col gap-[4px]">
                        <h3> Notification Header </h3>
                        <input
                            placeholder="Header"
                            className='text-white border border-gray-600 p-[8px] rounded-[4px]'
                            value={notification.Header}
                            onChange={(e) =>
                                setNotification((prev) => ({
                                    ...prev,
                                    Header: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-[4px]">
                        <h3> Notification Body </h3>
                        <input
                            placeholder="Body"
                            className='text-white border border-gray-600 p-[8px] rounded-[4px]'
                            value={notification.Body}
                            onChange={(e) => {
                                setNotification((prev) => ({
                                    ...prev,
                                    Body: e.target.value,
                                }))
                            }
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-[12px]">
                        <div className="flex flex-row gap-[8px]">
                            <button onClick={() =>
                                setNotification(prev => ({ ...prev, Tag: "Donation" }))
                            } className={`underline hover:cursor-pointer text-white
                            ${notification.Tag === "Donation" ? "opacity-60" : "opacity-100"}`}> Donation </button>
                            <button onClick={() =>
                                setNotification(prev => ({ ...prev, Tag: "Followers" }))
                            } className={`underline hover:cursor-pointer text-white
                            ${notification.Tag === "Followers" ? "opacity-60" : "opacity-100"}`}> Followers </button>
                        </div>
                    </div>
                    {notification.Body && notification.Header !== null ?
                        <button className='bg-white p-[8px] rounded-[4px]' onClick={() => {
                            console.log("Firing Notification", notification),
                                setData([notification, ...fetchData()]);
                        }}> <p className='white'>Add Notification</p> </button>
                        :
                        ""
                    }
                </div>
            </div >
            <div className="flex flex-col gap-[24px]">
                <div className="flex flex-row justify-between">
                    <p className='text-white'> Timeline </p>
                    <button onClick={() => { setOpenTimeline(!openTimeline) }}>
                        {openTimeline === true ?
                            <p className='text-white hover:cursor-pointer hover:opacity-60 opacity-100'>close</p> :
                            <p className='text-white hover:cursor-pointer hover:opacity-60 opacity-100'>open</p>}
                    </button>
                </div>
                <div className="flex flex-col gap-[24px]">
                    <p className="text-white"> Upcoming Emotions</p>
                    <StageQueue></StageQueue>
                </div>
                <div className="flex gap-[12px] flex-row">
                    <button className='bg-gray-800 p-[24px] rounded-[4px] w-full' onClick={() => { generateInsights("happy", 10) }}> <p className='text-white'>Happy</p></button>
                    <button className='bg-gray-800 p-[24px] rounded-[4px] w-full' onClick={() => { generateInsights("sad", 5) }}> <p className='text-white'>Sad</p></button>
                    <button className='bg-gray-800 p-[24px] rounded-[4px] w-full' onClick={() => { generateInsights("angry", 2) }}> <p className='text-white'>Angry</p></button>
                    <button className='bg-gray-800 p-[24px] rounded-[4px] w-full' onClick={() => { generateInsights("excited", 4) }}> <p className='text-white'>Excited</p></button>

                </div>
            </div>
        </div >
    );
}