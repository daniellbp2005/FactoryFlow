import {Globe, LayoutGrid} from "lucide-react"

export default function Sidebar() {
    return (
        <>
            <div
                className="d-flex flex-column flex-shrink-0 p-3 vh-100 bg-dark border-end bg-border "
                style={{ width: 280 }}
            >
                <a
                    href="/"
                    className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-light text-decoration-none"
                >
                    <svg className="bi me-2" width={40} height={32}>
                        <use xlinkHref="#bootstrap" />
                    </svg>
                    <span className="fs-4">
                        <font dir="auto" style={{ verticalAlign: "inherit" }}>
                            <font dir="auto" style={{ verticalAlign: "inherit" }}>
                                Logo
                            </font>
                        </font>
                    </span>
                </a>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item">
                        <a href="#" className="nav-link active" aria-current="page">
                            <svg className="bi me-2" width={16} height={16}>
                                <use xlinkHref="#home" />
                            </svg>
                            <font dir="auto" style={{ verticalAlign: "inherit" }}>
                                <font dir="auto" style={{ verticalAlign: "inherit" }}>
                                <LayoutGrid size={22} />Lar
                                </font>
                            </font>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="nav-link link-light">
                            <svg className="bi me-2" width={16} height={16}>
                                <use xlinkHref="#speedometer2" />
                            </svg>
                            <font dir="auto" style={{ verticalAlign: "inherit" }}>
                                <font dir="auto" style={{ verticalAlign: "inherit" }}>
                                <Globe size={20} />Painel
                                </font>
                            </font>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="nav-link link-light">
                            <svg className="bi me-2" width={16} height={16}>
                                <use xlinkHref="#table" />
                            </svg>
                            <font dir="auto" style={{ verticalAlign: "inherit" }}>
                                <font dir="auto" style={{ verticalAlign: "inherit" }}>
                                <Globe size={20} />Pedidos
                                </font>
                            </font>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="nav-link link-light ">
                            <svg className="bi me-2" width={16} height={16}>
                                <use xlinkHref="#grid" />
                            </svg>
                            <font dir="auto" style={{ verticalAlign: "inherit" }}>
                                <font dir="auto" style={{ verticalAlign: "inherit" }}>
                                <Globe size={20} />Produtos
                                </font>
                            </font>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="nav-link link-dark ">
                            <svg className="bi me-2" width={16} height={16}>
                                <use xlinkHref="#people-circle" />
                            </svg>
                            <font dir="auto" style={{ verticalAlign: "inherit" }}>
                                <font dir="auto" style={{ verticalAlign: "inherit" }}>
                                <Globe size={20} />Clientes
                                </font>
                            </font>
                        </a>
                    </li>
                </ul>
                <hr />
                <div className="dropdown">
                    <a
                        href="#"
                        className="d-flex align-items-center link-light text-decoration-none dropdown-toggle"
                        id="dropdownUser2"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <img
                            src="https://github.com/mdo.png"
                            alt=""
                            width={32}
                            height={32}
                            className="rounded-circle me-2"
                        />
                        <strong>
                            <font dir="auto" style={{ verticalAlign: "inherit" }}>
                                <font dir="auto" style={{ verticalAlign: "inherit" }}>
                                    User
                                </font>
                            </font>
                        </strong>
                    </a>
                    <ul
                        className="dropdown-menu text-small shadow"
                        aria-labelledby="dropdownUser2"
                        style={{}}
                    >
                        <li>
                            <a className="dropdown-item" href="#">
                                <font dir="auto" style={{ verticalAlign: "inherit" }}>
                                    <font dir="auto" style={{ verticalAlign: "inherit" }}>
                                        sair
                                    </font>
                                </font>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>


        </>
    )
}