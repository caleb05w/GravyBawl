"use client"

import React, { useState, useEffect } from 'react'
import { getData, setData } from "../components/data"
import NotificationList from '../components/notificationList';
import DevPanel from '../components/devPanel';

export default function Test() {


    const message = getData;

    useEffect(() => { console.log(getData()) }, [])
    return (
        <div className='page flex flex-row gap-[58px]'>
            <NotificationList></NotificationList>
            <DevPanel></DevPanel>
        </div >
    )
}