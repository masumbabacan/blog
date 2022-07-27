import React from 'react'
import '../assets/styles/footer.css';
import '../assets/styles/reset.css';

function Footer() {
  return (
    <>
    <section className="newslettre">
        <div className="container">
            <div className="newslettre-width">
                <div className="newslettre-info">
                    <h5>Subscribe to our Newslatter</h5>
                    <p> Sign up for free and be the first to get notified about new posts. </p>
                 </div>
                <form action="#" className="newslettre-form">
                    <div className="form-flex">
                        <input type="text"/><button className="submit-btn" type="submit">Subscribe</button>
                    </div>
                </form>
                <div className="social-icones">
                    <ul className="list-inline">
                        <li>
                            <a href="#">
                                <i className="fab fa-facebook-f"></i>Facebook</a>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fab fa-twitter"></i>Twitter </a>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fab fa-instagram"></i>Instagram </a>
                        </li>
                        <li>
                            <a href="#">
                                <i className="fab fa-youtube"></i>Youtube</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <footer className="footer">
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-12">
                    <div className="copyright">
                        <p>© Copyright 2021  <a href="#">AssiaGroupe</a> , All rights reserved.</p>
                    </div>
                    <div className="back">
                        <a href="#" className="back-top">
                            <i className="arrow_up"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </footer>    
    </>
  )
}

export default Footer