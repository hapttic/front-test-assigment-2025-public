import Logo from "../assets/logo.svg"

function Header() {
  return (
    <div className="p-4 border-b border-b-white/10">
        <img src={Logo} alt="Logo" />
    </div>
  )
}

export default Header