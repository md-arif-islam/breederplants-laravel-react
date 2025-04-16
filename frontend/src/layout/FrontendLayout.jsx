import { Outlet } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation";
import Header from "../components/Header";

const FrontendLayout = () => {
    return (
        <div>
            <Header />
            <main className="flex-grow pb-20 md:pb-24">
                <Outlet />
            </main>
            <BottomNavigation />
        </div>
    );
};

export default FrontendLayout;
