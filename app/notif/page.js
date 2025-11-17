"use client"

import React, { useState, useEffect, useRef } from "react";
import { getData, setData } from "../components/data";
import NotificationList from "../components/notificationList";

function page() {
    return (
        <div><NotificationList /></div>
    )
}

export default page