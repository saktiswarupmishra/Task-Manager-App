import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="main-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">T</div>
          <span className="footer-text">© {new Date().getFullYear()} TaskFlow. All rights reserved.</span>
        </div>
        <div className="footer-links">
          <a href="#" className="footer-link">Privacy</a>
          <a href="#" className="footer-link">Terms</a>
          <a href="#" className="footer-link">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
