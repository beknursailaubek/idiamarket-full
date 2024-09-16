import { Link } from "react-router-dom";
import { useContext } from "react";
import { CityContext } from "../../context/CityContext";
import Logo from "../../assets/images/logo.svg";
import Whatsapp from "../../assets/images/icons/whatsapp.svg";
import Instagram from "../../assets/images/icons/instagram.svg";
import Youtube from "../../assets/images/icons/youtube.svg";
import "./Footer.css";

const Footer = () => {
    const { selectedCity } = useContext(CityContext);
    const cityPrefix = selectedCity.uri ? `/${selectedCity.uri}` : "";

    return (
        <footer className="footer">
            <div className="footer__content">
                <div className="container">
                    <div className="footer__columns">
                        <div className="footer__column">
                            <Link className="footer__logo logo" to={cityPrefix}>
                                <img src={Logo} alt="Логотип" className="logo__image" />
                            </Link>

                            <ul className="footer__contacts">
                                <li className="footer__contact">
                                    <a href="#" className="footer__link contact contact__address">
                                        <span className=" contact__city">г. Алматы</span>, 050008, ул. Мынбаева 43 (уг.ул. Манаса)
                                    </a>
                                </li>
                                <li className="footer__contact ">
                                    <a href="tel:87273449900" className="footer__link contact contact__phone">
                                        8 (727) 344-99-00
                                    </a>
                                </li>
                                <li className="footer__contact ">
                                    <a href="tel:87012667700" className="footer__link contact contact__phone">
                                        +7 (701) 266-77-00
                                    </a>
                                </li>
                                <li className="footer__contact ">
                                    <a href="mailto:zakaz@idiamarket.kz" className="footer__link contact contact__mail">
                                        zakaz@idiamarket.kz
                                    </a>
                                </li>
                            </ul>

                            <ul className="footer__contacts">
                                <li className="footer__contact">
                                    <a href="#" className="footer__link contact contact__address">
                                        <span className=" contact__city">г. Астана</span>, 010000, ул. Бейсекбаева 24/1, 2-этаж, бизнес центр DARA
                                    </a>
                                </li>
                                <li className="footer__contact ">
                                    <a href="tel:87172279900" className="footer__link contact contact__phone">
                                        8 (7172) 27-99-00
                                    </a>
                                </li>
                                <li className="footer__contact ">
                                    <a href="tel:87015112200" className="footer__link contact contact__phone">
                                        +7 (701) 511-22-00
                                    </a>
                                </li>
                                <li className="footer__contact ">
                                    <a href="mailto:astana@idiamarket.kz" className="footer__link contact contact__mail">
                                        astana@idiamarket.kz
                                    </a>
                                </li>
                            </ul>

                            <ul className="footer__contacts">
                                <li className="footer__contact">
                                    <a href="#" className="footer__link contact contact__address">
                                        <span className="contact__city">г. Шымкент</span>, ул. Мадели кожа 35/1, (уг.ул. Байтурсынова) 1-этаж, бизнес-центр BNK
                                    </a>
                                </li>
                                <li className="footer__contact ">
                                    <a href="tel:87273449900" className="footer__link contact contact__phone">
                                        8 (727) 344-99-00
                                    </a>
                                </li>
                                <li className="footer__contact ">
                                    <a href="tel:87012667700" className="footer__link contact contact__phone">
                                        +7 (701) 266-77-00
                                    </a>
                                </li>
                                <li className="footer__contact ">
                                    <a href="mailto:zakaz@idiamarket.kz" className="footer__link contact contact__mail">
                                        zakaz@idiamarket.kz
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="footer__column">
                            <p className="footer__title">Категории</p>

                            <ul className="footer__menu">
                                <li className="footer__item">
                                    <Link to={`${cityPrefix}/category/stellazhi/torgovye`} className="footer__link">
                                        Торговые стеллажи
                                    </Link>
                                </li>
                                <li className="footer__item">
                                    <Link to={`${cityPrefix}/category/torgovoe-oborudovanie`} className="footer__link">
                                        Торговое оборудование
                                    </Link>
                                </li>
                                <li className="footer__item">
                                    <Link to={`${cityPrefix}/category/holodilnoe-oborudovanie`} className="footer__link">
                                        Холодильное оборудование
                                    </Link>
                                </li>
                                <li className="footer__item">
                                    <Link to={`${cityPrefix}/category/oborudovanie-dlya-obshepita`} className="footer__link">
                                        Оборудование для общепита
                                    </Link>
                                </li>
                                <li className="footer__item">
                                    <Link to={`${cityPrefix}/category/pos-oborudovanie`} className="footer__link">
                                        POS оборудование
                                    </Link>
                                </li>
                                <li className="footer__item">
                                    <Link to={`${cityPrefix}/category/kommercheskaya-mebel`} className="footer__link">
                                        Коммерческая мебель
                                    </Link>
                                </li>
                                <li className="footer__item">
                                    <Link to={`${cityPrefix}/category/skladskie-stellazhi`} className="footer__link">
                                        Складские стеллажи
                                    </Link>
                                </li>
                                <li className="footer__item">
                                    <Link to={`${cityPrefix}/category/nejtralnoe-oborudovanie`} className="footer__link">
                                        Нейтральное оборудование
                                    </Link>
                                </li>
                                <li className="footer__item">
                                    <Link to={`${cityPrefix}/category/metallicheskie-shkafy`} className="footer__link">
                                        Металлические шкафы
                                    </Link>
                                </li>
                                <li className="footer__item">
                                    <Link to={`${cityPrefix}/category/oborudovanie-dlya-aptek`} className="footer__link">
                                        Оборудование для аптек
                                    </Link>
                                </li>
                                <li className="footer__item">
                                    <Link to={`${cityPrefix}/category/palletnye-stellazhi`} className="footer__link">
                                        Паллетные стеллажи
                                    </Link>
                                </li>
                                <li className="footer__item">
                                    <Link to={`${cityPrefix}/category/kassovye-boksy`} className="footer__link">
                                        Кассовые боксы
                                    </Link>
                                </li>
                                <li className="footer__item">
                                    <Link to={`${cityPrefix}/category/vitriny`} className="footer__link">
                                        Витрины
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="footer__column">
                            <Link to={cityPrefix} className="footer__title footer__link">
                                Главная
                            </Link>

                            <ul className="footer__menu">
                                <li className="footer__item">
                                    <a href="#" className="footer__link">
                                        Проекты
                                    </a>
                                </li>
                                <li className="footer__item">
                                    <a href="" className="footer__link">
                                        3D Дизайн
                                    </a>
                                </li>
                                <li className="footer__item">
                                    <a href="" className="footer__link">
                                        Доставка
                                    </a>
                                </li>
                                <li className="footer__item">
                                    <a href="" className="footer__link">
                                        О нас
                                    </a>
                                </li>
                                <li className="footer__item">
                                    <a href="" className="footer__link">
                                        Отзывы
                                    </a>
                                </li>
                                <li className="footer__item">
                                    <a href="" className="footer__link">
                                        Контакты
                                    </a>
                                </li>
                            </ul>

                            <div className="footer__subscribe subscribe">
                                <p className="subscribe__text">Подпишитесь на последние обновления и узнавайте о новинках и специальных предложениях первыми</p>
                                <input type="email" className="subscribe__input" placeholder="Email" />
                                <button className="subscribe__button">Подписаться</button>
                            </div>

                            <div className="footer__socials socials">
                                <a href="#" className="socials__item socials__item_whatsapp">
                                    <img className="socials__icon socials__icon_whatsapp" src={Whatsapp} alt="" />
                                </a>
                                <a href="#" className="socials__item socials__item_instagram">
                                    <img className="socials__icon socials__icon_instagram" src={Instagram} alt="" />
                                </a>
                                <a href="#" className="socials__item socials__item_youtube">
                                    <img className="socials__icon socials__icon_youtube" src={Youtube} alt="" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer__copyright">
                <div className="container">
                    <div className="copyright">
                        <span>&copy; ТОО «IDIA Market» 2010-{new Date().getFullYear()}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
