import Admin from "./pages/ADMIN";
import {Admin_Route, Ff_Route, Of_Route, Reg_Route, Rules_Route, Login_Route} from "./utils/const";
import OwnForm from "./pages/own_form";
import FriendForm from "./pages/friend_form";
import Autorise from "./pages/AUTORISE";
import Rules from "./pages/RULES";


export const authRoutes = [
    {
        path: Admin_Route,
        Component: Admin
    },

    {
        path: Ff_Route,
        Component: FriendForm
    },

    {
        path: Of_Route,
        Component: OwnForm
    }

]
export const publicRoutes = [
    {
        path: Reg_Route,
        Component: Autorise
    },

    {
        path: Login_Route,
        Component: Autorise
    },

    {
        path: Rules_Route,
        Component: Rules
    }
]