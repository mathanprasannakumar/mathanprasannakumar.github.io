"use client"
import emailjs from "@emailjs/browser"
import {useRef} from "react"

const Contact=()=>
{    
    const form = useRef(null); 

    const sendEmail=(e)=>{
            e.preventDefault();   

            emailjs.sendForm(
                process.env.NEXT_PUBLIC_EMAIL_JS_SERVICE_ID,
                process.env.NEXT_PUBLIC_EMAIL_JS_TEMPLATE_ID,
                form.current,
                {
                   publicKey: process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY 
                }
            ).then(
                ()=>{
                    console.log("SUCCESS!");
                },
                (error)=>{
                    console.log("Failed",error.text);
                }
            )
    }

    return (
             <div className=" bg-slate-100 text-black" id="contact"> 
                <div className="mx-48 p-10 space-y-10">
                    <h3 className="font-bold text-4xl text-center">Contact</h3>
                    <div className="bg-black p-10 rounded-3xl flex space-x-20">
                        <form ref={form} className="bg-white p-10 rounded-3xl space-y-2 w-96" onSubmit={sendEmail}>
                            <label htmlFor="name" className="block font-bold text-xl">Name</label>
                            <input type="text" id="name" name="name" placeholder="Enter your name" required className="h-10 block p-2 border border-gray-400 rounded-xl w-full"></input>

                            <label htmlFor="email" className="block font-bold text-xl">Email</label>
                            <input type="text" id="email" name="email" placeholder="Enter your email" required className="h-10 block p-2 border border-gray-400 rounded-xl w-full"></input>

                            <label htmlFor="messsage" className="block font-bold text-xl">Description</label>
                            <textarea id="message" name="message" rows={5} className="block p-2 border border-gray-400 rounded-xl w-full" placeholder="Hi! How are you"required></textarea>

                            <div className="text-center">
                                <button className="p-2 rounded-xl bg-black text-white mt-5 w-20 hover:text-black hover:bg-slate-400">Submit</button>
                            </div>
                        </form>
                        <div className="text-white text-5xl pt-40 font-semibold font-roboto space-y-10">
                            <h3 className=""> Thanks for visiting my site !</h3>
                            <h3 className="bg-slate-50 p-2 rounded-3xl text-black"> Lets do something greater together.</h3>
                        </div>
                    </div>
                </div>
            </div>)
}

export default Contact;