import React from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {

    const linkStyle = {
        transition: "0.2s ease",
        color: "white",
        textDecoration: "none"
    };

    return (
        <nav className="navbar navbar-expand-lg bg-success fixed-top">
            <div className="container-fluid">

                <Link
                    className="navbar-brand"
                    to="/"
                    style={linkStyle}
                    onMouseEnter={(e) => e.target.style.color = "#c8ffd4"}
                    onMouseLeave={(e) => e.target.style.color = "white"}
                >
                    Islam
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/"
                                style={linkStyle}
                                onMouseEnter={(e) => e.target.style.color = "#c8ffd4"}
                                onMouseLeave={(e) => e.target.style.color = "white"}
                            >
                                Home
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/calender"
                                style={linkStyle}
                                onMouseEnter={(e) => e.target.style.color = "#c8ffd4"}
                                onMouseLeave={(e) => e.target.style.color = "white"}
                            >
                                Calendar
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/prayer"
                                style={linkStyle}
                                onMouseEnter={(e) => e.target.style.color = "#c8ffd4"}
                                onMouseLeave={(e) => e.target.style.color = "white"}
                            >
                                Prayer Time
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/surah"
                                style={linkStyle}
                                onMouseEnter={(e) => e.target.style.color = "#c8ffd4"}
                                onMouseLeave={(e) => e.target.style.color = "white"}
                            >
                                Surah
                            </Link>
                        </li>

                    </ul>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;