"use client";

import React, { useState, useEffect, useRef } from "react"
import Notification from "./notification";
import NotificationData, { fetchData, addRandomNotification } from "../data/notificationData";
import { getEmotionalData } from "../data/EmotionData";
import Random from "./random";
import { FaBell } from "react-icons/fa";
import { FaExpandAlt } from "react-icons/fa";

export default function NotificationList() {

    const [selected, setSelected] = useState("All");
    const [newNotificationIds, setNewNotificationIds] = useState(new Set());

    // Initialize items with filter applied
    const getFilteredItems = (items, filter) => {
        if (filter === "System") {
            return items.filter((n) => n.Tag === "Followers");
        } else if (filter === "Chat") {
            return items.filter((n) => n.Tag === "Donations");
        } else {
            return items; // All
        }
    };

    const initialItems = fetchData();
    const allItemsRef = useRef(initialItems);
    const [Items, setItems] = useState(() => getFilteredItems(initialItems, "All"));

    useEffect(() => {
        const update = () => {
            const allNewItems = fetchData();

            // Find new notifications (items that weren't in the previous list)
            const prevItems = allItemsRef.current;
            const prevIds = new Set(prevItems.map(item => item.id || JSON.stringify(item)));
            const newIds = new Set();

            allNewItems.forEach(item => {
                const itemId = item.id || JSON.stringify(item);
                if (!prevIds.has(itemId)) {
                    newIds.add(itemId);
                }
            });

            // Mark new notifications for animation
            if (newIds.size > 0) {
                setNewNotificationIds(newIds);
                // Remove animation class after animation completes
                setTimeout(() => {
                    setNewNotificationIds(new Set());
                }, 600); // Animation duration
            }

            // Apply current filter to new items
            const filteredItems = getFilteredItems(allNewItems, selected);

            allItemsRef.current = allNewItems;
            setItems(filteredItems);
        };

        window.addEventListener("notifications-updated", update);
        return () => window.removeEventListener("notifications-updated", update);
    }, [selected]);


    // Automatically add notifications every 5-10 seconds, but only when a stage is in queue
    useEffect(() => {
        const scheduleNext = () => {
            // Check if there's a stage in queue
            const emotionalData = getEmotionalData();
            if (emotionalData.length === 0) {
                // No stages queued, check again in 1 second
                const timeoutId = setTimeout(() => {
                    scheduleNext();
                }, 1000);
                return timeoutId;
            }

            // Random delay between 5-10 seconds (5000-10000ms)
            const delay = 5000 + Math.random() * 5000;

            const timeoutId = setTimeout(() => {
                // Check again if stage is still in queue before adding
                const currentEmotionalData = getEmotionalData();
                if (currentEmotionalData.length > 0) {
                    addRandomNotification();
                }
                scheduleNext(); // Schedule the next one
            }, delay);

            return timeoutId;
        };

        const timeoutId = scheduleNext();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);

    const handleFilter = (filter) => {
        const data = fetchData(); // always grab latest
        allItemsRef.current = data;
        const filteredData = getFilteredItems(data, filter);
        setItems(filteredData);
        setSelected(filter);
    };

    console.log("data:" + fetchData())

    return (
        < div className='w-[100vw] max-h-[100vh] bg-black rounded-[8px] flex flex-col gap-[24px] pb-[24px]' >
            <div className="flex flex-row justify-between align-middle items-center h-fit w-full px-[24px] pt-[24px]">
                <div className="flex flex-row gap-[8px]">
                    <button className="rounded-full bg-red-500 w-[12px] h-[12px]"></button>
                    <button className="rounded-full bg-yellow-500 w-[12px] h-[12px]"></button>
                    <button className="rounded-full bg-green-500 w-[12px] h-[12px]"></button>
                </div>
                <div className="flex flex-row gap-[8px]">
                    <FaBell className='text-white' />
                    <FaExpandAlt className='text-white' />
                </div>
            </div>
            <div className=" border-[0.5px] border-[#656567]"></div>
            <div className='flex flex-row items-center gap-[8px] px-[16px]'>
                <FaBell className='text-white' />
                <h4> Notifications </h4>
            </div>
            <div className="flex flex-row gap-[8px] px-[16px]">
                {/* //tbh should make a button compeonent */}
                <button className={`border border-gray-600 px-[12px] py-[12px] rounded-[8px] hover:bg-white hover:text-black w-full text-center
                    ${selected === "Chat" ? "bg-white text-black" : "bg-black text-white"}`} onClick={() => { handleFilter("Chat") }}> <p className="">Chat</p></button>
                <button className={`border border-gray-600 px-[12px] py-[12px] rounded-[8px] hover:bg-white hover:text-black w-full text-center
                    ${selected === "System" ? "bg-white text-black" : "bg-black text-white"}`} onClick={() => { handleFilter("System") }}> <p className="">System</p></button>
                <button className={`border border-gray-600 px-[12px] py-[12px] rounded-[8px] hover:bg-white hover:text-black w-full text-center
                    ${selected === "All" ? "bg-white text-black" : "bg-black text-white"}`} onClick={() => { handleFilter("All") }}> <p className="t">All</p></button>
            </div>
            <div className="flex flex-col gap-[24px] my-[24px] overflow-auto overscroll-y-auto h-[100vh] notification-scrollbar px-[16px]">
                {Items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-[48px] h-[100vh]">
                        <p className="text-white opacity-60 text-sm">No notifications</p>
                    </div>
                ) : (
                    Items.map((key, index) => {
                        const itemId = key.id || JSON.stringify(key);
                        const isNew = newNotificationIds.has(itemId);
                        return (
                            <div
                                key={itemId}
                                className={`notification-item h-fit ${isNew ? 'slide-in' : ''}`}
                            >
                                <Notification
                                    Img={key.Img}
                                    Header={key.Header}
                                    Body={key.Body}
                                />
                            </div>
                        );
                    })
                )}
            </div>
            <div className="flex flex-row justify-center w-full text-center gap-[12px] items-center">
                <p className='text-white'>page</p>
                <div className=" bg-white p-[2px] px-[8px] rounded-[4px]"> 12</div>
                <div className=" text-white"> <p>24</p> </div>
            </div>
        </div >
    );
}