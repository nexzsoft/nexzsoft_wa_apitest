import { Link } from "react-router-dom";
import "./CallToAction.css";

function CallToAction() {
  return (
    <section className="cta">
      <div className="container">
        <h2>Get Ready to Transform Your Customer Engagement</h2>

        <p>
          Create memorable customer experiences that inspire trust by resolving customer queries faster, turning every challenging interaction into an opportunity to build lasting relationships, drive new business opportunities, and foster customer loyalty. 
          <br /><br />
          Strengthen your brand reputation, enhance customer satisfaction, and drive sustainable business growth with every conversation.
        </p>

        <div className="cta-buttons">
          <Link to="/contact-sales" className="cta-btn">
            Get started Free
          </Link>

          <Link to="/pricing" className="cta-btn secondary">
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CallToAction;
