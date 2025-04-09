import { Home, Info, Newspaper, User } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function BottomNavigation() {
    const navItems = [
        { name: "Catalog", to: "/", icon: Home },
        { name: "News", to: "/news", icon: Newspaper },
        { name: "About", to: "/about", icon: Info },
        {
            name: "Portal",
            to: "https://portal.breederplants.nl",
            icon: User,
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md z-40">
            <ul className="flex justify-around p-2">
                {navItems.map((item) => (
                    <li key={item.name}>
                        <NavLink
                            to={item.to}
                            className={({ isActive }) =>
                                `flex flex-col items-center p-2 ${
                                    isActive
                                        ? "text-green-500"
                                        : "text-gray-600"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon
                                        className={`w-5 h-5 md:w-6 md:h-6 ${
                                            isActive ? "stroke-15" : "stroke-15"
                                        }`}
                                    />
                                    <span className="text-xs md:text-base mt-1">
                                        {item.name}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
