import Image from "next/image"
import profile from "../../public/profile-transformed-bff.png";
import wavesuperone from "../../public/wave_super_one.png"
import wavesupertwo from "../../public/wave_super_two.png"


const About=() =>
{
    return (
        <div className="h-screen " id="about">
            <div className="mx-72  mb-[205px] pt-[350px] ps-[50px] pb-[50px] pr-[50px] text-black rounded-3xl">
                <div className="bg-white p-10 rounded-3xl w-[800px]">
                    <p className="mb-14 font-extrabold text-6xl"> Hi there! I'm Mathan.</p>
                    <p className="mb-3 text-xl font-bold">Software Developer specializing in AI and Robotics. </p>
                    <p className="mb-3 text-xl font-bold">I am passionate about working at the intersection of AI and low level systems.</p>
                    <p className="mb-3 text-xl font-bold">These days i am focused on building highly scalable, low-latency applications targeted to resource constraint environments</p>
                </div>
            </div>
            <Image className="absolute top-[60px] left-[1100px] z-40" src={profile} height="700" alt="my picture "></Image>
        </div>
    )
}

export default About;