"use client";

import React, { useState, useEffect } from "react"
import Notification from "./notification";
import { setData, fetchData, getRandomFace } from "../data/notificationData"
import StageQueue from "./stageQueue";
import { getBaseMetrics, setBaseMetrics } from "../data/BaseMetrics";
import { generateInsights } from "../data/EmotionData";
//calling function for storing notifs

// Array of available face images
const faceOptions = Array.from({ length: 10 }, (_, i) => ({
    value: `/images/face${i + 1}.png`,
    label: `Face ${i + 1}`
}));

export default function DevPanel() {

    const [openNotif, setOpenNotif] = useState(false);
    const [openTimeline, setOpenTimeline] = useState(false);
    const [openBaseMetrics, setOpenBaseMetrics] = useState(false);
    const [notification, setNotification] = useState({ Img: "/images/face10.png", Header: "Hello", Body: "Test", Tag: "Donation" });
    const [baseMetrics, setBaseMetricsState] = useState(getBaseMetrics());

    // Subscribe to base metrics updates
    useEffect(() => {
        const update = () => {
            setBaseMetricsState(getBaseMetrics());
        };

        window.addEventListener("base-metrics-updated", update);
        update(); // initial load

        return () => window.removeEventListener("base-metrics-updated", update);
    }, []);
    return (
        <div className='bg-black border-2 border-gray-[800] h-fit w-[400px] m-[24px] p-[24px] rounded-[8px] flex flex-col gap-[24px]' draggable="true">
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
                    <div className="flex flex-col gap-[4px]">
                        <h3> Face Image </h3>
                        <div className="flex flex-row flex-wrap gap-[8px]">
                            {faceOptions.map((face) => (
                                <button
                                    key={face.value}
                                    onClick={() =>
                                        setNotification(prev => ({ ...prev, Img: face.value }))
                                    }
                                    className={`border rounded-[4px] p-[4px] hover:opacity-80 transition-all
                                    ${notification.Img === face.value ? "border-white border-2" : "border-gray-600"}`}
                                >
                                    <img
                                        src={face.value}
                                        alt={face.label}
                                        className="w-[40px] h-[40px] rounded-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
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
                                setData([{ ...notification, Img: notification.Img || getRandomFace(), id: Date.now() + Math.random() }, ...fetchData()]);
                        }}> <p className='white'>Add Notification</p> </button>
                        :
                        ""
                    }
                </div>
            </div >
            <div className="flex flex-col gap-[24px]">
                <div className="flex flex-row justify-between">
                    <p className='text-white'> Base Metrics </p>
                    <button onClick={() => { setOpenBaseMetrics(!openBaseMetrics) }}>
                        {openBaseMetrics === true ?
                            <p className='text-white hover:cursor-pointer hover:opacity-60 opacity-100'>close</p> :
                            <p className='text-white hover:cursor-pointer hover:opacity-60 opacity-100'>open</p>}
                    </button>
                </div>
                <div className={`flex-col gap-[16px] overflow-hidden
                    ${openBaseMetrics === true ? "max-w-[100vh] flex" : "max-h-0 hidden"}`}>
                    <div className="flex flex-col gap-[12px]">
                        <div className="flex flex-col gap-[4px]">
                            <h3 className="text-white"> Viewers </h3>
                            <input
                                type="number"
                                className='text-white border border-gray-600 p-[8px] rounded-[4px] bg-black'
                                value={baseMetrics.Views}
                                onChange={(e) => {
                                    const newValue = parseInt(e.target.value) || 0;
                                    setBaseMetrics({ Views: newValue });
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-[4px]">
                            <h3 className="text-white"> Messages Per Minute </h3>
                            <input
                                type="number"
                                className='text-white border border-gray-600 p-[8px] rounded-[4px] bg-black'
                                value={baseMetrics.MessagesPerMinute}
                                onChange={(e) => {
                                    const newValue = parseInt(e.target.value) || 0;
                                    setBaseMetrics({ MessagesPerMinute: newValue });
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-[4px]">
                            <h3 className="text-white"> Followers </h3>
                            <input
                                type="number"
                                className='text-white border border-gray-600 p-[8px] rounded-[4px] bg-black'
                                value={baseMetrics.Followers}
                                onChange={(e) => {
                                    const newValue = parseInt(e.target.value) || 0;
                                    setBaseMetrics({ Followers: newValue });
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-[4px]">
                            <h3 className="text-white"> Subscribers </h3>
                            <input
                                type="number"
                                className='text-white border border-gray-600 p-[8px] rounded-[4px] bg-black'
                                value={baseMetrics.Subscribers}
                                onChange={(e) => {
                                    const newValue = parseInt(e.target.value) || 0;
                                    setBaseMetrics({ Subscribers: newValue });
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-[4px]">
                <div className="flex flex-row justify-between">
                    <p className='text-white'> Timeline </p>
                    <button onClick={() => { setOpenTimeline(!openTimeline) }}>
                        {openTimeline === true ?
                            <p className='text-white hover:cursor-pointer hover:opacity-60 opacity-100'>close</p> :
                            <p className='text-white hover:cursor-pointer hover:opacity-60 opacity-100'>open</p>}
                    </button>
                </div>
                <div className={`flex-col gap-[12px]
                    ${openTimeline === true ? "flex" : "hidden"}`}>
                    <div className="flex gap-[12px] flex-row pt-[7px]">
                        <button className='border border-gray-800 p-[24px] rounded-[4px] w-full' onClick={() => { generateInsights("happy", 15) }}>
                            <p className='text-white'>Happy</p>
                        </button>
                        <button className='border border-gray-800 p-[24px] rounded-[4px] w-full' onClick={() => { generateInsights("sad", 15) }}>
                            <p className='text-white'>Sad</p>
                        </button>
                        <button className='border border-gray-800 p-[24px] rounded-[4px] w-full' onClick={() => { generateInsights("anger-sad", 15) }}>
                            <p className='text-white'>Anger-Sad</p>
                        </button>
                        <button className='border border-gray-800 p-[24px] rounded-[4px] w-full' onClick={() => { generateInsights("idle", 15) }}>
                            <p className='text-white'>Idle</p>
                        </button>
                    </div>
                    <div className="flex flex-col gap-[24px]">
                        <p className="text-white"> Upcoming Emotions</p>
                        <StageQueue></StageQueue>
                    </div>
                </div>
            </div>
        </div >
    );
}