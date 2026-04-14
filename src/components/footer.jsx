import '../components/footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-left">
          <h3 className="footer-title">E-NAZARENO</h3>
          <p className="footer-desc">
            Isang Digital na Dambana ng Pananampalataya
          </p>
        </div>

        <div className="footer-links">
          <a href="#featured">Featured</a>
          <a href="#">All Books</a>
          <a href="#">About</a>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} E-Nazareno. All rights reserved.</p>
        </div>

      </div>
    </footer>
  )
}
export default Footer;