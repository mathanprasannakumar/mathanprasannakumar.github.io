"use client"
import Link from "next/link";
import {useState,useEffect} from "react";


const Navbar = ( )=>{

    const [fontColor,setfontColor] = useState<string>("text-white");

    useEffect(()=>{
        // render function
        const handleScroll =()=>{
            const experiencesection = document.getElementById("experience");
            const aboutsection = document.getElementById("about");
           
            const experiencesectionpos = experiencesection?.getBoundingClientRect();
            const aboutsectionpos = aboutsection?.getBoundingClientRect(); 
            
            if(experiencesectionpos?.top <= 50 && experiencesectionpos?.bottom>50)
            {
                setfontColor("text-black");
            }
            else
                setfontColor("text-white");
        }

        window.addEventListener("scroll",handleScroll);
        // cleanup function 
        return(()=>{
            window.removeEventListener("scroll",handleScroll);
        })
    },[])

    return (
       <nav>
        {/* flexcontainer */}
            <div className={`px-80 py-10 flex items-center space-x-32 fixed w-full bg-slate-100 text-black z-20 rounded-3xl`}> 
                <div className="font-extrabold text-2xl">
                    <Link href="/">Mathan Prasanna Kumar</Link>
                </div>
                 <div className="font-semibold space-x-10 text-lg">
                    <Link href="#projects">Projects</Link>
                    <Link href="#experience">Experience</Link>
                    <Link href="#articles">Articles</Link>
                    <Link href="#about" >About</Link>
                    <Link href="#contact">Contact</Link>
                </div>
            </div>
       </nav> 
    )

}

export default Navbar;