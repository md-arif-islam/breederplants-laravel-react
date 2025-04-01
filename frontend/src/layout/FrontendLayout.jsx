import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";

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
