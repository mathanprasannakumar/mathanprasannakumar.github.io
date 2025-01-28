
const Project=()=>{
    return(
        <div className="bg-black h-screen" id="projects">
                <div className="mx-48 p-10 space-y-10">
                    <h3 className="font-bold text-4xl text-center">Projects</h3>
                    <div className="grid bg-slate-100 grid-rows-3 grid-cols-3 gap-10 p-10 rounded-3xl">
                        <div className="row-start-1 col-start-1 bg-black rounded-3xl">
                            <div className="flex flex-column items-center justify-center">
                                <p className="font-extrabold">A</p>
                            </div>
                        </div>
                        <div className="row-start-1 col-start-2 bg-black rounded-3xl">
                            <div className="flex flex-column items-center justify-center">
                                <p className="font-extrabold">B</p>
                            </div>
                        </div>
                        <div className="row-start-1 col-start-3 bg-black rounded-3xl">
                            <div className="flex flex-column items-center justify-center">
                                <p className="font-extrabold">C</p>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default Project;