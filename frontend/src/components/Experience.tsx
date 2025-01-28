"use client"
import Image from "next/image"
import robotoailogo from "../../public/robotoai_logo.png"
import PositionCard  from "./PositionCard"
import { StaticImageData } from "next/image"
import {useState} from "react"

interface PosDetail
{
    role: string;
    start: string;
    end: string;
    company: string; 
    logo: StaticImageData; 
    triangle_right_oriented: boolean;
}

const InternRole :PosDetail = 
{
    role: "Software Developer Intern (Vision Systems)",
    start: "Sep 2023",
    end: "July 2024",
    company: "Robotoai Technologies",
    logo: robotoailogo,
    triangle_right_oriented: false,
}

const FullRole :PosDetail = 
{
    role: "Software Developer (Vision Systems)",
    start: "July 2024",
    end: "Current",
    company: "Robotoai Technologies",
    logo: robotoailogo,
    triangle_right_oriented: true,
}


const Experience =()=>
{
    const [hoverState,sethoverState]=useState<string | null>(null);

    return(
        <div className=" bg-slate-300 text-black" id="experience">
            <div className="mx-48 p-10 space-y-10 ">
                <h3 className="font-bold text-4xl text-center">Experience</h3>
                <div className="grid grid-rows-2 grid-cols-[1fr_0.03fr_1fr] gap-10 p-8 bg-black rounded-3xl">
                    {/* { here based onthe hoverstate i an insert visualize and element  } */}
                    <div className={`col-start-1 row-start-1 rounded-3xl font-extrabold p-5 bg-slate-100 row-span-2
                                    ${hoverState==="1-3"?"opacity-100 scale-100 transform transition-all duration-300 z-10"
                                                        :"opacity-0 scale-50"}`}>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et ducimus neque labore animi aut, 
                            aliquam ipsa dolorum odit optio. Cupiditate voluptate tenetur aspernatur adipisci ipsam 
                            esse voluptates recusandae officia explicabo?</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et ducimus neque labore animi aut, 
                            aliquam ipsa dolorum odit optio. Cupiditate voluptate tenetur aspernatur adipisci ipsam 
                            esse voluptates recusandae officia explicabo?</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et ducimus neque labore animi aut, 
                            aliquam ipsa dolorum odit optio. Cupiditate voluptate tenetur aspernatur adipisci ipsam 
                            esse voluptates recusandae officia explicabo?</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et ducimus neque labore animi aut, 
                            aliquam ipsa dolorum odit optio. Cupiditate voluptate tenetur aspernatur adipisci ipsam 
                            esse voluptates recusandae officia explicabo?</p>
                    </div>
                    <div className={`row-start-1 col-start-3 row-span-2 rounded-3xl bg-slate-100  p-5 font-extrabold
                        ${hoverState==="2-1"?"opacity-100 scale-100 transform transition-all duration-300 z-10"
                        :"opacity-0 scale-50"}`}>

                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et ducimus neque labore animi aut, 
                            aliquam ipsa dolorum odit optio. Cupiditate voluptate tenetur aspernatur adipisci ipsam 
                            esse voluptates recusandae officia explicabo?</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et ducimus neque labore animi aut, 
                            aliquam ipsa dolorum odit optio. Cupiditate voluptate tenetur aspernatur adipisci ipsam 
                            esse voluptates recusandae officia explicabo?</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et ducimus neque labore animi aut, 
                            aliquam ipsa dolorum odit optio. Cupiditate voluptate tenetur aspernatur adipisci ipsam 
                            esse voluptates recusandae officia explicabo?</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Et ducimus neque labore animi aut, 
                            aliquam ipsa dolorum odit optio. Cupiditate voluptate tenetur aspernatur adipisci ipsam 
                            esse voluptates recusandae officia explicabo?</p>
                    </div>
                   
                    <PositionCard 
                        position={FullRole}
                        gridpos="row-start-1 col-start-3"
                        onHover={()=>
                        {   sethoverState("1-3") 
                        }}
                        onLeave={()=>sethoverState(null)}>
                    </PositionCard>
                     <PositionCard 
                        position={InternRole}
                        gridpos="row-start-2 col-start-1"
                        onHover={()=>{
                            sethoverState("2-1")
                        }}
                        onLeave={()=>{sethoverState(null)}}
                        >
                    </PositionCard>

                    <div className="col-start-2 row-span-2 bg-slate-100 rounded-xl"></div>
                  
                </div>
            </div>
        </div>
    )
}

export default Experience