import Navbar from "@/components/Navbar"
import About from "@/components/About"
import Experience from "@/components/Experience"
import Project from "@/components/Project"
import Contact from "@/components/Contact"

export default function Home() {
  return (
    <div>
      <main>
        <Navbar/>        
        <About/>
        <Experience/>
        <Project/>
        <Contact/>
      </main>
    </div>
  );
}
