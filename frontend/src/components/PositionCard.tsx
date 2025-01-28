'use client'
import Image from "next/image"
import robotoailogo from "../../public/robotoai_logo.png"
import { StaticImageData} from "next/image";
import React from "react"
import {useState} from "react"
import { stringify } from "querystring";

interface PosDetail
{
    role: string;
    start: string;
    end: string;
    company: string; 
    logo: StaticImageData; 
    triangle_right_oriented: boolean;
}

interface PosProps
{
    position: PosDetail;
    onHover: ()=>void;
    onLeave: ()=>void;
    gridpos: string;
}

const PositionCard:React.FC<PosProps>=({position, onHover,onLeave,gridpos})=>
{
    const [hovered,setHovered]  = useState<boolean>(false);

    const hoverhandler=()=>
    {
        onHover();
        setHovered(true);
    }
   
    const leavehandler=()=>
    {
        onLeave();
        setHovered(false);
    }

    return(
        <div className={`font-extrabold relative p-3 ${gridpos} bg-slate-100 rounded-3xl flex flex-col items-center justify-center z-0`}
        onMouseEnter={hoverhandler}
        onMouseLeave={leavehandler}
        >
            <p className="bg-slate-300 rounded-xl p-3"> {position.start} {"-"} {position.end}</p>
            <Image className="text-center" src={position.logo} height="150" alt="logo"></Image>
            <div className=" bg-slate-300 rounded-xl p-3 text-center">
                <p>{position.role} {" @ "}</p>
                <a href="https://robotoai.com/" className="hover:text-blue-500">{position.company}</a>
            </div>

            {(!position.triangle_right_oriented) ?
                    <>
                        <div className="absolute w-0 h-0 border-t-[25px] border-t-transparent border-b-[25px] border-b-transparent border-r-[43.3px] border-r-slate-100 top-1/2 left-full"></div>
                        <div className={`absolute w-0 h-0 border-t-[25px] border-t-transparent border-b-[25px] border-b-transparent border-l-[43.3px] border-l-slate-100 top-1/2 left-full ml-14
                                        ${hovered?"opacity-100":"opacity-0"}`}></div>
                    </>                
                :
                <>
                    <div className="absolute w-0 h-0 border-t-[25px] border-t-transparent border-b-[25px] border-b-transparent border-l-[43.3px] border-l-slate-100 top-1/2 -left-11"></div>
                    <div className={`absolute w-0 h-0 border-t-[25px] border-t-transparent border-b-[25px] border-b-transparent border-r-[43.3px] border-r-slate-100 top-1/2 -left-24
                            ${hovered?"opacity-100":"opacity-0"}`}></div>
                </>
            }
        </div>
    )
}


export default PositionCard;