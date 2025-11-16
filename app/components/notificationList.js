"use client";

import React, { useState, useEffect } from "react"
import Notification from "./notification";
import NotificationData, { fetchData } from "../data/notificationData";
import Random from "./random";

export default function NotificationList() {

    const [Items, setItems] = useState(() => fetchData());
    const [selected, setSelected] = useState("All");

    useEffect(() => {
        const update = () => {
            setItems(fetchData()); // refresh UI
        };

        window.addEventListener("notifications-updated", update);
        return () => window.removeEventListener("notifications-updated", update);
    }, []);

    const handleFilter = (filter) => {
        const data = fetchData(); // always grab latest
        if (filter === "Followers") {
            setItems(data.filter((n) => n.Tag === "Followers"));
        } else if (filter === "Donations") {
            setItems(data.filter((n) => n.Tag === "Donations"));
        } else {
            setItems(data); // All
        }
        setSelected(filter);
    };

    console.log("data:" + fetchData())

    return (
        < div className='max-w-[20%] max-h-[80%] bg-black m-4 rounded-[8px] flex flex-col gap-[24px] p-[16px]' >
            <div className="flex flex-row gap-[8px]">
                <div className="bg-red-500 rounded-full h-[12px] w-[12px]"></div>
                <div className="bg-green-500 rounded-full h-[12px] w-[12px]"></div>
                <div className="bg-yellow-500 rounded-full h-[12px] w-[12px]"></div>
            </div>
            <h2> Notifications </h2>
            <div className="flex flex-row gap-[8px]">
                {/* //tbh should make a button compeonent */}
                <button className={`border border-gray-600 px-[12px] py-[12px] rounded-[8px] hover:bg-white hover:text-black w-full text-center
                    ${selected === "Donations" ? "bg-white text-black" : "bg-black text-white"}`} onClick={() => { handleFilter("Donations") }}> <p className="">Donations</p></button>
                <button className={`border border-gray-600 px-[12px] py-[12px] rounded-[8px] hover:bg-white hover:text-black w-full text-center
                    ${selected === "Followers" ? "bg-white text-black" : "bg-black text-white"}`} onClick={() => { handleFilter("Followers") }}> <p className="">Followers</p></button>
                <button className={`border border-gray-600 px-[12px] py-[12px] rounded-[8px] hover:bg-white hover:text-black w-full text-center
                    ${selected === "All" ? "bg-white text-black" : "bg-black text-white"}`} onClick={() => { handleFilter("All") }}> <p className="t">All</p></button>
            </div>
            <div className="flex flex-col gap-[24px] my-[24px] overflow-auto overscroll-y-auto max-h-[80vh] ">
                {Items.map((key) => (
                    // random ass key to prevent key conflicts
                    <Notification
                        key={Random()}
                        Img={key.Img}
                        Header={key.Header}
                        Body={key.Body}
                    />
                ))}
            </div>
            <div className="flex flex-row justify-center w-full text-center gap-[12px] items-center">
                <p className='text-white'>page</p>
                <div className=" bg-white p-[2px] px-[8px] rounded-[4px]"> 12</div>
                <div className=" text-white"> <p>24</p> </div>
            </div>
        </div >
    );
}