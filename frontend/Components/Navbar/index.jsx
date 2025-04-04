import './navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <img src="/Logo.png" alt="" className="mainLogo" />
      <div className="logoTitle mainLogoTitle">
        <p style={{ color: '#0796ef' }}>DEEP</p>
        <p style={{ color: 'white' }}>NET</p>
      </div>
      <p className="logoTitle lastTitle" style={{ color: '#857878' }}>
        SOFT
      </p>
      <div className="navigationList">
        <button className="navButton">HOME</button>
        <button className="navButton">MENU</button>
        <button className="navButton">MAKE A RESERVATION</button>
        <button className="navButton">CONTACT US</button>
      </div>
    </div>
  );
};

export default Navbar;
