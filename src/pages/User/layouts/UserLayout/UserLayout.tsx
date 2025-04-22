import { Outlet } from "react-router-dom";
import UserSideNav from "../../components/UserSideNav";

export default function UserLayout() {
    return (
        <div>
            <div>
                <UserSideNav />
                <Outlet />
            </div>
        </div>
    );
}
