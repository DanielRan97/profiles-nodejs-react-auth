import Router from "../../router/router";
import classes from './layout.module.css';
import Nav from "./nav/nav";


const Layout = () => {

    return(
        <div>
            <header>
                <Nav />
            </header>
            <main className={classes.layoutMain}>
                <Router />
            </main>
            <footer className={classes.layoutFooter}></footer>
        </div>
    );
};

export default Layout;