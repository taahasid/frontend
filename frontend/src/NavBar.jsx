import React, { Component } from "react";
import { AppBar, Toolbar, IconButton, Button, MenuItem, Menu, Tabs, Tab, createMuiTheme, ThemeProvider,  } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { Link } from "react-router-dom";
// import { navlinks, theme, defaults } from "./Defaults";
import { ProfileType } from "./components/Profile";
import PropTypes from "prop-types";
import "./NavBar.css";
import Logo from "./components/Landing/Sections/Logo.jsx";
import { goToAnchor } from "react-scrollable-anchor";
import { CoreModule } from "@hackru/frontend-core";

const LinkSwitcher = (props) => {
    return props.root ? <a {...props}>{props.children}</a> : <Link {...props} />;
};
LinkSwitcher.propTypes = {
    root: PropTypes.bool,
    children: PropTypes.any,
};

const color_theme = createMuiTheme({
    palette: {
        primary: {
            main: theme.primary[1].trim(),
        },
        secondary: {
            main: theme.secondary[1].trim(),
        },
    },
});
const NavBar = CoreModule(({ theme, defaults, navLinks, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [shouldRender, setShouldRender] = useState(0);
    const [badgeHeight, setBadgeHeight] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [landingValue, setLandingValue] = useState(0);

    function handleResize() {
        let badge = document.getElementById("mlh-trust-badge");
        if (badge == null) {
            return;
        }
        setBadgeHeight(parseFloat(
                window
                    .getComputedStyle(badge)
                    .getPropertyValue("height")
                    .replace("px", "")
        ));
    }

    function handleScroll() {
        let offset = window.pageYOffset;
        if (offset < badgeHeight) {
            setShouldRender(1);
        } else if (shouldRender === 0 && offset > badgeHeight) {
            setShouldRender(1);
        }
        let currentHash = window.location.href.substring(window.location.href.indexOf("#") + 1);
        switch (currentHash) {
        case "home":
            setLandingValue(0);
            break;
        case "about":
            setLandingValue(1);
            break;
        case "schedule":
            setLandingValue(2);
            break;
        case "sponsors":
            setLandingValue(3);
            break;
        case "partners":
            setLandingValue(4);
            break;
        case "numbers":
            setLandingValue(5);
            break;
        default:
            setLandingValue(0);
            break;
        }
    }
    function toggleFalse() {
        if (window.innerWidth < 768) {
            setIsOpen(false);
        }
    }
    function toggle() {
        setIsOpen(!isOpen);
    }
    function getAuthButtons(){
        return (
            <div style={{ marginLeft: "auto" }}>
                <Link to="/login">
                    <Button outline
                        color="warning"
                        className="pill-btn">
                        Login
                    </Button>
                </Link>{" "}
                <Link to="/signup">
                    <Button color="success"
                        className="pill-btn">
                        Register
                    </Button>
                </Link>
            </div>
        );
    }

    function setAnchorEl(value) {
        setAnchorEl(value);
        setIsOpen(!isOpen);
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setIsOpen(!isOpen);
    }
    function handleClose() {
        this.setAnchorEl(null);
    }
    function getDashboardButton() {
        return (
            <div style={{ marginLeft: "auto" }}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="Profile"
                    aria-haspopup="true"
                    aria-owns={this.state.open ? "Profile" : undefined}
                    onClick={this.handleClick}
                    color="inherit"
                    iconStyle={{ width: 80, height: 80 }}
                >
                    <AccountCircle style={{ fontSize: "40px", color: "white" }} />
                </IconButton>
                <Menu
                    id="Profile"
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <MenuItem
                        onClick={this.handleClose}
                        style={{ color: "black" }}
                        component={Link}
                        to="/profile"
                    >
                        Profile
                    </MenuItem>
                    <MenuItem
                        onClick={this.handleClose}
                        style={{ color: "black" }}
                        component={Link}
                        to="/logout"
                    >
                        Logout
                    </MenuItem>
                </Menu>
            </div>
        );
    }
    function getNavLinks() {
        let keys = Object.keys(navlinks);
        let navLinks = [];

        for (let i = 0; i < keys.length - 1; i++) {
            navLinks.push(
                <Tab
                    style={{ color: "white", minWidth: 10, marginLeft: "25px" }}
                    key={i}
                    value={i + 100}
                    index={i}
                    component={Link}
                    onClick={() => goToAnchor(navlinks[keys[i]].url, true)}
                    to={navlinks[keys[i]].url}
                    scrollButtons="auto"
                    label={keys[i].toString()}
                />
            );
        }
        return navLinks;
    }
    function handleLandingChange = (event, newValue) => {
        setLandingValue(newValue);
    };
    function getLandingNav() {
        return (
            <React.Fragment>
                {this.getNavLinks()}
            </React.Fragment>
        );
    }
    function getDashboardNav() {
        return (
            <React.Fragment>
                {/* { this.props.profile._registration_status !== "unregistered" && */}
                <Tab
                    style={{ color: "white", minWidth: 10, marginLeft: "25px" }}
                    className={window.innerWidth < 768 ? "pt-3" : ""}
                    component={Link}
                    to={"/dashboard"}
                    label="Dashboard"
                />
                {/* } */}
                { defaults.teamru &&
                    <Tab
                        style={{ color: "white", minWidth: 10, marginLeft: "25px" }}
                        className={window.innerWidth < 768 ? "pt-3" : ""}
                        component={Link}
                        to={"/teamru"}
                        label="TeamRU"
                    />
                }
            </React.Fragment>
        );
    }

    return (
        let path = window.location.pathname;
        let onDashboard = path === "/dashboard" || path === "/profile" || path.includes("/teamru");
        let onLogin = path === "/login" || path === "/signup";
        let onLanding = path === "/";
        // Show no navbar on the projector page
        if (path === "/projector") {
            return null;
        }
        if (!defaults.freeze) {
            return (
                <AppBar
                    id="navbar"
                    style={{
                        width: "100%",
                        zIndex: "20",
                        backgroundColor: theme.secondary[1],
                        opacity: this.state.shouldRender | !onLanding,
                        pointerEvents: this.state.shouldRender | !onLanding ? "auto" : "none",
                        transition: !onLanding ? "" : "opacity 0.5s",
                        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
                    }}
                    fixed="top"
                    dark
                    expand="md"
                    onBlur={this.toggleFalse}
                >
                    <Toolbar style={{ marginLeft: "0em" }}>
                        <ThemeProvider theme={color_theme}>
                            <Tabs
                                style={{ marginLeft: "auto", overflowY: "hidden" }}
                                scrollButtons="on"
                                value={0}
                                variant="scrollable"
                                indicatorColor="secondary">
                                <div>
                                    <div
                                        style={{
                                            display: "block",
                                            paddingRight: 0,
                                            marginTop: -25,
                                            marginBottom: -250,
                                            width: 200,
                                            marginRight: -10,
                                            marginLeft: -30,
                                            overflowY: "hidden"
                                        }}>
                                        <a href="/#home"
                                            className="logo-no-underline"
                                            style={{ height: "10px !important", textDecoration: "none" }}
                                            root={onLanding.toString()}>
                                            <Logo
                                                color="white"
                                                repeat={false}
                                                noCircle
                                                style={{ marginLeft: "10px" }}
                                                src="/assets/icons/hru-text-dyn.svg"
                                            />
                                        </a>
                                    </div>
                                </div>
                                <div>
                                    {onLogin ? <div/> : onDashboard ? this.getDashboardNav() : this.getLandingNav()}
                                </div>
                            </Tabs>
                        </ThemeProvider>
                        {this.props.profile.isLoggedIn ? this.getDashboardButton() : this.getAuthButtons()}
                    </Toolbar>
                </AppBar>
            );
        } else {
            return null;
        }

    );
}, ["theme", "defaults", "navLinks"]);

export { NavBar };



