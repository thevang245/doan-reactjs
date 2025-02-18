import { Outlet } from "react-router-dom";
import Header from "./Part/Header";
import Footer from "./Part/Footer";

function Layout() {
    return ( <>
    <Header/>
    <Outlet/>
    <Footer/>
    </> );
}

export default Layout;