import Header from './header';
import {Outlet} from "react-router-dom";

export default function Layout() {
    return(
        <main>
            <Header />   {/* the header will be displayed for all pages */}
            <Outlet />   {/* the rest pages will be changed,.. thts y we use outlet */}
        </main>
    );
}