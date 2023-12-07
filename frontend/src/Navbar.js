import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
    
    const path = window.location.href;
    let showlogout = () =>{
        if (path.includes('/login') || path.includes('/register') || path.includes('/forgetpassword') || path === ('http://localhost:3000/')) {
            return false;
        } 
        return true;
    }

    const showlist = () => {
        const list = document.getElementById("list");
        if (list.style.display === "none") {
            list.style.display = "block";
        } else {
            list.style.display = "none";
        }
    }

    return (
        <nav className="navbar bg-dark" data-bs-theme="dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">
                    <h1 className="h3 mb-3 fw-normal">&#128138;Medicare</h1>
                </a>
                {showlogout() && (<button type="button" className="btn" onClick={showlist} id='logout'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" className="bi bi-person-fill" viewBox="0 0 16 16">
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                    </svg>
                </button>)}
            </div>
            <ul className="list-group list-group-flush" style={{display:'none', width:'100%'}} id='list'>
                <a href="/login" className="list-group-item list-group-item-action text-white text-end">Sign out</a>
            </ul>
        </nav>
        );
};

export default Navbar;