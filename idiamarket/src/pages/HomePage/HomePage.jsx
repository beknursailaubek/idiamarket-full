import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import ProductCard from "../../components/ProductCard/ProductCard";
import { CityContext } from "../../context/CityContext";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// import required modules
import { Navigation, Pagination } from "swiper/modules";

import Banner_1 from "../../assets/images/banner-1.png";
import ArrowLeft from "../../assets/images/icons/arrow-left.svg";
import ArrowRight from "../../assets/images/icons/arrow-right.svg";
import ArrowUp from "../../assets/images/icons/arrow-up.svg";
import ArrowDown from "../../assets/images/icons/arrow-down.svg";
import Category_1 from "../../assets/images/categories/torgovye-stellazhi.png";
import Category_2 from "../../assets/images/categories/kommercheskaya-mebel.png";
import Category_3 from "../../assets/images/categories/kassovye-boksy.png";
import Category_4 from "../../assets/images/categories/palletnye-stellazhi.png";
import Category_5 from "../../assets/images/categories/skladskie-stellazhi.png";
import Category_6 from "../../assets/images/categories/torgovoe-oborudovanie.png";
import Category_7 from "../../assets/images/categories/holodilnoe-oborudovanie.png";
import Category_8 from "../../assets/images/categories/pos-oborudovanie.png";
import Category_9 from "../../assets/images/categories/vitriny.png";
import Category_10 from "../../assets/images/categories/metallicheskie-shkafy.png";
import Category_11 from "../../assets/images/categories/oborudovanie-dlya-aptek.png";
import Category_12 from "../../assets/images/categories/nejtralnoe-oborudovanie.png";
import Category_13 from "../../assets/images/categories/oborudovanie-dlya-obshepita.png";

import "./HomePage.css";

const HomePage = () => {
  const [isAboutHidden, setIsAboutHidden] = useState(true);
  const [dayProducts, setDayProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [domLoaded, setDomLoaded] = useState(false);
  const [error, setError] = useState(null);

  const { selectedCity } = useContext(CityContext);
  const cityPrefix = selectedCity.uri ? `/${selectedCity.uri}` : "";

  // Handle initial DOM load
  useEffect(() => {
    setDomLoaded(true);
  }, []);

  // Fetch day products
  useEffect(() => {
    const fetchDayProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products/day`);
        if (!response.ok) throw new Error("Failed to fetch day products");
        const data = await response.json();
        setDayProducts(data);
      } catch (error) {
        setError("Could not load day products.");
      }
    };
    fetchDayProducts();
  }, []);

  // Fetch popular products
  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products/popular`);
        if (!response.ok) throw new Error("Failed to fetch popular products");
        const data = await response.json();
        setPopularProducts(data);
      } catch (error) {
        console.error("Error fetching popular products:", error);
        setError("Could not load popular products.");
      }
    };

    fetchPopularProducts();
  }, []);

  // Fetch category counts
  useEffect(() => {
    const fetchCategoryCounts = async () => {
      const categoryCodes = ["torgovye-stellazhi", "kommercheskaya-mebel", "kassovye-boksy", "palletnye-stellazhi", "skladskie-stellazhi", "torgovoe-oborudovanie", "holodilnoe-oborudovanie", "pos-oborudovanie", "vitriny", "metallicheskie-shkafy", "oborudovanie-dlya-aptek", "nejtralnoe-oborudovanie", "oborudovanie-dlya-obshepita"];

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/categories/count`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category_codes: categoryCodes }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching category counts:", error);
        setError("Could not load category counts.");
      }
    };

    fetchCategoryCounts();
  }, []);

  const toggleAboutHidden = () => {
    setIsAboutHidden(!isAboutHidden);
  };
  return (
    <>
      <Helmet>
        <title>IDIA Market – купить торговое оборудование</title>
        <meta name="description" content="Качественные товары по доступным ценам на idiamarket.kz" />
        <link rel="canonical" href="https://www.idiamarket.kz/" />
      </Helmet>
      <main className="main main_home">
        <section className="welcome">
          <div className="container">
            <div className="welcome__inner">
              <div className="welcome__banner banner">
                {domLoaded && (
                  <Swiper
                    loop={true}
                    pagination={{
                      clickable: true,
                    }}
                    navigation={{ nextEl: ".banner__arrow_next", prevEl: ".banner__arrow_prev" }}
                    modules={[Navigation, Pagination]}
                    className="banner__swiper"
                  >
                    <SwiperSlide>
                      <img width={970} height={380} className="swiper-slide" src={Banner_1} alt="" />
                    </SwiperSlide>
                    <SwiperSlide>
                      <img className="swiper-slide" src={Banner_1} alt="" />
                    </SwiperSlide>
                  </Swiper>
                )}

                <div className="banner__nav">
                  <button className="banner__arrow banner__arrow_prev">
                    <img className="banner-arrow__icon" src={ArrowLeft} alt="" />
                  </button>
                  <button className="banner__arrow banner__arrow_next">
                    <img className="banner-arrow__icon" src={ArrowRight} alt="" />
                  </button>
                </div>
              </div>

              <div className="welcome__product-card product-cards">
                <p className="product-cards__title">Товар дня</p>
                {dayProducts && dayProducts.length > 0 ? (
                  <>
                    {domLoaded && (
                      <Swiper loop={true} navigation={{ nextEl: ".product-card__arrow_next", prevEl: ".product-card__arrow_prev" }} modules={[Navigation]} className="product-card__swiper">
                        {dayProducts.map((product, index) => (
                          <SwiperSlide key={index}>
                            <ProductCard type={"day"} key={index} product={product} />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    )}

                    <div className="product-card__nav">
                      <button className="product-card__arrow product-card__arrow_prev">
                        <img className="product-card-arrow__icon" src={ArrowLeft} alt="" />
                      </button>
                      <button className="product-card__arrow product-card__arrow_next">
                        <img className="product-card-arrow__icon" src={ArrowRight} alt="" />
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="categories">
          <div className="container">
            <p className="title categories__title">Категории</p>

            <div className="categories__box">
              <div className="categories__group categories__group_3">
                <Link to={`${cityPrefix}/category/stellazhi/torgovye-stellazhi`} className="categories__item category category__torgovye-stellazhi">
                  <span className="category__count">Товаров: {categories["torgovye-stellazhi"] || 0}</span>
                  <img loading="lazy" className="category__image" src={Category_1} alt="Торговые стеллажи" />
                  <p className="category__title">Торговые стеллажи</p>
                </Link>
                <Link to={`${cityPrefix}/category/kommercheskaya-mebel`} className="categories__item category category_md category__kommercheskaya-mebel">
                  <span className="category__count">Товаров: {categories["kommercheskaya-mebel"] || 0}</span>
                  <img loading="lazy" className="category__image" src={Category_2} alt="Коммерческая мебель" />
                  <p className="category__title">Коммерческая мебель</p>
                </Link>
              </div>

              <div className="categories__group categories__group_4">
                <Link to={`${cityPrefix}/category/kassovye-boksy`} className="categories__item category category_sm category__kassovye-boksy">
                  <span className="category__count">Товаров: {categories["kassovye-boksy"] || 0}</span>
                  <img loading="lazy" className="category__image" src={Category_3} alt="Кассовые боксы" />
                  <p className="category__title">Кассовые боксы</p>
                </Link>
                <Link to={`${cityPrefix}/category/palletnye-stellazhi`} className="categories__item category category_sm category__palletnye-stellazhi">
                  <span className="category__count">Товаров: {categories["palletnye-stellazhi"] || 0}</span>
                  <img loading="lazy" className="category__image" src={Category_4} alt="Паллетные стеллажи" />
                  <p className="category__title">Паллетные стеллажи</p>
                </Link>
                <Link to={`${cityPrefix}/category/skladskie-stellazhi`} className="categories__item category category__skladskie-stellazhi">
                  <span className="category__count">Товаров: {categories["skladskie-stellazhi"] || 0}</span>
                  <img loading="lazy" className="category__image" src={Category_5} alt="Складские стеллажи" />
                  <p className="category__title">Складские стеллажи</p>
                </Link>
                <Link to={`${cityPrefix}/category/torgovoe-oborudovanie`} className="categories__item category category__torgovoe-oborudovanie">
                  <span className="category__count">Товаров: {categories["torgovoe-oborudovanie"] || 0}</span>
                  <img loading="lazy" className="category__image" src={Category_6} alt="Торговое оборудование" />
                  <p className="category__title">Торговое оборудование</p>
                </Link>
              </div>

              <div className="categories__group categories__group_3">
                <Link to={`${cityPrefix}/category/holodilnoe-oborudovanie`} className="categories__item category category__holodilnoe">
                  <span className="category__count">Товаров: {categories["holodilnoe-oborudovanie"] || 0}</span>
                  <img loading="lazy" className="category__image" src={Category_7} alt="Холодильное оборудование" />
                  <p className="category__title">Холодильное оборудование</p>
                </Link>
                <Link to={`${cityPrefix}/category/pos-oborudovanie`} className="categories__item category category_md category__pos-oborudovanie">
                  <span className="category__count">Товаров: {categories["pos-oborudovanie"] || 0}</span>
                  <img loading="lazy" className="category__image" src={Category_8} alt="POS оборудование" />
                  <p className="category__title">POS оборудование</p>
                </Link>
                <Link to={`${cityPrefix}/category/vitriny`} className="categories__item category category_md category__vitriny">
                  <span className="category__count">Товаров: {categories["vitriny"] || 0}</span>
                  <img loading="lazy" className="category__image" src={Category_9} alt="Витрины" />
                  <p className="category__title">Витрины </p>
                </Link>
                <Link to={`${cityPrefix}/category/metallicheskie-shkafy`} className="categories__item category category__metallicheskie-shkafy">
                  <span className="category__count">Товаров: {categories["metallicheskie-shkafy"] || 0}</span>
                  <img loading="lazy" className="category__image" src={Category_10} alt="Металлические шкафы" />
                  <p className="category__title">Металлические шкафы</p>
                </Link>
              </div>

              <div className="categories__group categories__group_4">
                <Link to={`${cityPrefix}/category/oborudovanie-dlya-aptek`} className="categories__item category category_sm category__oborudovanie-dlya-aptek">
                  <span className="category__count">Товаров: {categories["oborudovanie-dlya-aptek"] || 0}</span>
                  <img loading="lazy" className="category__image" src={Category_11} alt="Оборудование для аптек" />
                  <p className="category__title">Оборудование для аптек</p>
                </Link>
                <Link to={`${cityPrefix}/category/nejtralnoe-oborudovanie`} className="categories__item category category__nejtralnoe-oborudovanie">
                  <span className="category__count">Товаров: {categories["nejtralnoe-oborudovanie"] || 0}</span>
                  <img loading="lazy" className="category__image" src={Category_12} alt="Нейтральное оборудование" />
                  <p className="category__title">Нейтральное оборудование</p>
                </Link>
                <Link to={`${cityPrefix}/category/oborudovanie-dlya-obshepita`} className="categories__item category category_sm category__oborudovanie-dlya-obshepita">
                  <span className="category__count">Товаров: {categories["oborudovanie-dlya-obshepita"] || 0}</span>
                  <img loading="lazy" className="category__image" src={Category_13} alt="Оборудование для общепита" />
                  <p className="category__title">Оборудование для общепита</p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="popular">
          <div className="container">
            <div className="popular__inner">
              <p className="title popular__title">Популярные товары</p>
              {popularProducts && popularProducts.length > 0 ? (
                <div className="popular__products">
                  {popularProducts.map((product) => (
                    <ProductCard key={product.sku} product={product}></ProductCard>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="about">
          <div className="container">
            <h2 className="about__title title">Интернет магазин IDIAMARKET.KZ</h2>
            <div className={`about__inner ${isAboutHidden ? "about__inner_hidden" : ""}`}>
              <h1 className="about__h1">Интернет-магазин IDIA Market – торговое, холодильное и складское оборудование</h1>
              <p className="about__text">Интернет-магазин IDIA Market предлагает широкий ассортимент торгового, холодильного и складского оборудования в Казахстане. Мы являемся надежным партнером для бизнеса, предоставляя высококачественные товары по доступным ценам. В нашем каталоге вы найдете торговые стеллажи, торговое оборудование, холодильное оборудование, оборудование для общепита, POS оборудование, коммерческую мебель, складские стеллажи, нейтральное оборудование, металлические шкафы, оборудование для аптек, паллетные стеллажи, кассовые боксы и витрины.</p>
              <p className="about__text">Преимущества покупки в IDIA Market очевидны. Выбирая наш интернет-магазин, вы получаете широкий ассортимент товаров для бизнеса, доступные цены и выгодные предложения, удобные условия доставки, а также высокое качество продукции. Мы предлагаем купить торговое и холодильное оборудование с доставкой во все города Казахстана: Алматы, Астана, Шымкент, Караганда, Актобе, Тараз, Павлодар, Усть-Каменогорск, Семей и другие. Заказав товары у нас, вы можете быть уверены в их надежности и долговечности.</p>
              <p className="about__text">Почему стоит выбрать IDIA Market? Наш интернет-магазин предлагает широкий выбор товаров, удобный поиск и навигацию по сайту, что позволяет быстро найти нужный товар. Профессиональная консультация и поддержка помогут вам сделать правильный выбор. Мы обеспечиваем быструю обработку заказов и оперативную доставку, чтобы вы могли получить необходимое оборудование в кратчайшие сроки.</p>
              <p className="about__text">Мы заботимся о своих клиентах, поэтому предлагаем удобные условия доставки. Вы можете заказать товар с доставкой до двери или выбрать самовывоз из наших складов. Стоимость доставки рассчитывается автоматически при оформлении заказа и зависит от региона и объема заказа.</p>
              <p className="about__text">Оформить заказ в нашем интернет-магазине легко и просто. Выберите нужный товар, добавьте его в корзину и следуйте инструкциям на сайте. Мы оперативно обработаем ваш заказ и свяжемся с вами для уточнения деталей. Этапы заказа включают выбор товара, добавление в корзину, оформление заказа, подтверждение и доставку. Наши клиенты ценят нас за качество товаров и высокий уровень сервиса. Присоединяйтесь к числу довольных покупателей и убедитесь в этом сами!</p>
              <p className="about__text">Наш интернет-магазин IDIA Market специализируется на продаже только самого качественного оборудования, чтобы обеспечить вашим бизнесам надежность и долговечность используемых материалов. Мы стремимся удовлетворить все потребности наших клиентов, предлагая современные решения для торговли, хранения и охлаждения продукции. У нас вы можете найти все необходимое для эффективной работы вашего предприятия.</p>
              <p className="about__text">Мы также гордимся нашими конкурентоспособными ценами и отличными предложениями. Наша команда работает без устали, чтобы обеспечить вам лучшие условия покупки, а также предоставить самые выгодные и удобные варианты доставки. Мы доставляем наши товары во все уголки Казахстана, включая самые отдаленные регионы, чтобы вы всегда могли рассчитывать на нас.</p>
              <p className="about__text">С IDIA Market вы можете быть уверены, что получите только высококачественное оборудование. Наш ассортимент постоянно обновляется, чтобы соответствовать современным требованиям и ожиданиям наших клиентов. Неважно, какого масштаба ваш бизнес – большой супермаркет, небольшой магазин или кафе – у нас найдется решение для любых потребностей. Мы предлагаем разнообразные стеллажи, витрины, холодильные установки и многое другое, чтобы помочь вам создать идеальные условия для торговли и хранения продукции.</p>
              <p className="about__text">Мы стремимся сделать процесс покупки максимально удобным и простым для вас. Наш сайт разработан с учетом всех современных стандартов, что позволяет быстро находить нужные товары и оформлять заказы. Наша служба поддержки всегда готова помочь вам с любыми вопросами и предоставить необходимую информацию.</p>
              <p className="about__text">Оформив заказ в IDIA Market, вы можете быть уверены в быстрой и надежной доставке. Мы предлагаем различные способы доставки, чтобы удовлетворить все ваши потребности. Вы можете выбрать доставку до двери или самовывоз из наших удобных пунктов выдачи. Мы также предлагаем гибкую систему скидок и акций, чтобы сделать ваши покупки еще более выгодными.</p>
              <p className="about__text">Наши клиенты всегда могут рассчитывать на нас в любых вопросах, связанных с покупкой оборудования. Мы ценим ваше доверие и всегда стремимся оправдать его, предлагая только лучшее оборудование и услуги. Присоединяйтесь к числу наших довольных клиентов и убедитесь в высоком качестве нашей продукции и сервиса. Ваш успех – наша цель!</p>
              <div className="about__hide">
                <div className={`about__btn`} onClick={toggleAboutHidden}>
                  <p className="about-btn__text">{isAboutHidden ? "ПОДРОБНЕЕ" : "СКРЫТЬ"}</p>
                  <img className="about-btn__img" src={isAboutHidden ? ArrowDown : ArrowUp} alt="" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default HomePage;
