import React from "react";
import Image from "next/image"


export default function notification({ Img, Header, Body }) {

    const placeholderImg = Img ?? "/images/face.png"
    const placeholderHeader = Header ?? "No Header"
    const placeholderBody = Body ?? "Placeholder No Body"
    return (
        <div className='flex flex-row gap-[16px] justify-start items-start justify-items-start overflow-hidden min-h-fit w-full max-w-xl'>
            <div className="">
                <Image
                    src={placeholderImg}
                    alt="My photo"
                    width={40}
                    height={40}
                    className='rounded-full overflow-hidden min-h-[50px] min-w-[50px] object-cover'
                />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
                <div className=""> <h3> {placeholderHeader}</h3></div>
                <p className="truncate shrink-0 opacity-[60%] text-white">
                    {placeholderBody}
                </p>
            </div>
        </div>
    );
}