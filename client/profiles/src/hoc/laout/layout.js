import Router from "../../router/router";
import classes from './layout.module.css';
import Nav from "./nav/nav";


const Layout = () => {

    return(
        <div className={classes.layOut}>
            <header>
                <Nav />
            </header>
            <main>
                <Router />
            </main>
        </div>
    );
};

export default Layout;