import Navbar from "../Navbarfolder/Navbar";

export default function Layout(prop){

    const styleL = {marginLeft:'280px'}

    return (
        <>
        <Navbar/>
        <div style={styleL}>
            {prop.children}
        </div>
        </>
    )
}