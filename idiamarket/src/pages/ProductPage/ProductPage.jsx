import React, { useState, useRef, useEffect } from "react";
import { useContext } from "react";
import { FavoritesContext } from "../../context/FavoritesContext";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./ProductPage.css";
import ArrowUp from "../../assets/images/icons/arrow-up.svg";
import ArrowDown from "../../assets/images/icons/arrow-down.svg";
import ArrowLeft from "../../assets/images/icons/arrow-left.svg";
import ArrowRight from "../../assets/images/icons/arrow-right.svg";
import Heart from "../../assets/images/icons/heart.svg";
import Compare from "../../assets/images/icons/compare.svg";
import Secure from "../../assets/images/icons/secure.webp";
import Delivery from "../../assets/images/icons/delivery.webp";
import Support from "../../assets/images/icons/support.webp";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// import required modules
import { Navigation, FreeMode, Thumbs } from "swiper/modules";

const ProductPage = () => {
  const [isAttributesHidden, setIsAttributesHidden] = useState(true);
  const [product, setProduct] = useState();
  const { uri } = useParams();

  useEffect(() => {
    let isMounted = true; // note this flag denotes mount status
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/product/${uri}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const result = await response.json();
        if (isMounted) {
          // add conditional check
          setProduct(result);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching product:", error);
          setProduct(null);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    }; // cleanup function to set isMounted to false when component unmounts
  }, [uri]);

  const { favorites, addToFavorite, removeFromFavorite } = useContext(FavoritesContext);

  const isFavorite = product && favorites.includes(product.sku);

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorite(product.sku);
    } else {
      addToFavorite(product.sku);
    }
  };

  const toggleAttributesHidden = () => {
    setIsAttributesHidden(!isAttributesHidden);
  };

  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const [transformOrigin, setTransformOrigin] = useState("center center");
  const [transform, setTransform] = useState("scale(1)");

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setTransformOrigin(`${x}% ${y}%`);
    setTransform("scale(2)");
  };

  const handleMouseLeave = () => {
    setTransformOrigin("center center");
    setTransform("scale(1)");
  };

  const attributesRef = useRef(null);

  const scrollToAttributes = () => {
    attributesRef.current.scrollIntoView({ behavior: "smooth" });
  };

  if (!product) {
    return (
      <div className="main">
        <div className="container"></div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ru-RU").format(price);
  };

  const category_code = product.categories && product.categories.length > 0 ? product.categories[product.categories.length - 1].category_code : null;

  const isTorgovyeStellazhi = product.categories.some((category) => category.category_code === "torgovye-stellazhi");

  return (
    <>
      <Helmet>
        <title>{product ? product.title : "IDIA Market"}</title>
        <meta name="description" content={product ? product.short_description?.map((desc) => desc.value).join(" ") : "Качественные товары по доступным ценам на idiamarket.kz"} />
        <link rel="canonical" href={`https://www.idiamarket.kz/p/${uri}`} />
      </Helmet>

      <main className="main">
        <div className="container">
          <Breadcrumbs code={category_code} productName={product.title} />
          <div className="product-page">
            <div className="product-page__body">
              <div className="product-page__main">
                <div className="product-page__card">
                  <div className="product-page__left">
                    {product.stickers && product.stickers.length > 0 ? (
                      <div className="product-page__stickers">
                        {product.stickers.map((label, index) => (
                          <span key={index} style={{ background: `${label.background_color}` }} className="product-card__label">
                            {label.title}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="product-page__slide_container">
                      <Swiper thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }} modules={[FreeMode, Navigation, Thumbs]} navigation={{ nextEl: ".product-page__arrow_next", prevEl: ".product-page__arrow_prev" }}>
                        {product.images.map((image, index) => (
                          <SwiperSlide className="product-page__slide_item" key={index} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                            <div className="thumbnail-container">
                              <img loading="lazy" className="product-page__slide_preview" src={image} alt={product.title} style={{ transformOrigin, transform }} />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      <div className="product-page__nav">
                        <button className="product-page__arrow product-page__arrow_prev">
                          <img className="product-page-arrow__icon" src={ArrowLeft} alt="" />
                        </button>
                        <button className="product-page__arrow product-page__arrow_next">
                          <img className="product-page-arrow__icon" src={ArrowRight} alt="" />
                        </button>
                      </div>
                    </div>
                    <div className="product-page__galery" style={{ width: `${product.images.length > 5 ? 340 : product.images.length * 60 + (product.images.length - 1) * 10}px` }}>
                      <Swiper style={{ width: `${product.images.length > 5 ? 340 : product.images.length * 60 + (product.images.length - 1) * 10}px` }} freeMode={true} watchSlidesProgress={true} onSwiper={setThumbsSwiper} slidesPerView={product.images.length > 5 ? 5 : product.images.length} spaceBetween={10} modules={[Navigation, FreeMode, Thumbs]} className="product-page__swiper">
                        {product.images.map((image, index) => (
                          <SwiperSlide key={index} style={{ height: "60px" }}>
                            <img className="product-page__slide" src={image} alt={product.title} />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                    <div className="product-page__advantages">
                      <div className="product-page__advantage">
                        <img className="product-page__advantage_image" src={Secure} alt="" />
                        <span className="product-page__advantage_text">Безопасная оплата</span>
                      </div>

                      <div className="product-page__advantage">
                        <img className="product-page__advantage_image" src={Delivery} alt="" />
                        <span className="product-page__advantage_text">Бесплатная доставка</span>
                      </div>

                      <div className="product-page__advantage">
                        <img className="product-page__advantage_image" src={Support} alt="" />
                        <span className="product-page__advantage_text">Консультация</span>
                      </div>
                    </div>

                    <div className="product-page__actions">
                      <div className="product-page__action">
                        <img className="product-page__action-icon" src={Compare} alt="" />
                        <div className="tooltip">Добавить в сравнение</div>
                      </div>
                      <div className={`product-page__action ${isFavorite ? "product-page__action_active" : ""}`} onClick={toggleFavorite}>
                        <img className="product-page__action-icon" src={Heart} alt="" />
                        <div className="tooltip">Добавить в избранное</div>
                      </div>
                    </div>
                  </div>
                  <div className="product-page__right">
                    <span className="product-page__code">Код товара: {product.sku}</span>
                    <h1 className="product-page__title title">{product.title}</h1>
                    {product.variants && product.variants.colors && product.variants.colors.length > 0 ? (
                      <div className="product-page__colors">
                        <p className="product-page__colors_title">{isTorgovyeStellazhi ? "Цвета RAL:" : "Цвета"}</p>

                        <div className="product-page__colors_list">
                          {product.variants.colors.map((variant) => (
                            <Link to={`/p/${variant.uri}`} className={`product-page__color_pallete ${product.color.code === variant.color.code ? "product-page__color_pallete-active" : null} `} style={{ backgroundColor: `${variant.color.hex}` }}></Link>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    <div className="product-page__buy">
                      <div className="product-page__price">
                        {product.price_from ? <span className="product-page__price-actual">от {formatPrice(product.price)} ₸</span> : <span className="product-page__price-actual">{formatPrice(product.price)} ₸</span>}
                        {product.old_price ? <span className="product-page__price-discount">{formatPrice(product.old_price)} ₸</span> : null}
                      </div>

                      {isTorgovyeStellazhi ? <button className="product-page__button-cart">Рассчитать</button> : <button className="product-page__button-cart">Купить</button>}
                    </div>

                    {product.variants && product.variants.attributes && product.variants.attributes.length > 0 ? (
                      <div className="product-page__variants">
                        <div className="product-page__variants__list">
                          {Object.entries(
                            product.variants.attributes.reduce((acc, variant) => {
                              const title = variant.attribute.title;
                              if (!acc[title]) acc[title] = [];
                              acc[title].push(variant);
                              return acc;
                            }, {})
                          ).map(([title, variants]) => (
                            <>
                              <p className="product-page__variants_title">{title}:</p>

                              <div key={title} className="product-page__variants_group">
                                {variants.map((variant, index) => {
                                  const isActiveVariant = product.attributes.some((attributeGroup) => attributeGroup.items.some((attributeItem) => attributeItem.value === variant.attribute.value));
                                  return (
                                    <Link key={index} to={`/p/${variant.uri}`} className={`product-page__variants_value ${isActiveVariant ? "product-page__variants_value-active" : ""}`}>
                                      {variant.attribute.value}
                                    </Link>
                                  );
                                })}
                              </div>
                            </>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {product.short_description && product.short_description.length > 0 ? (
                      <>
                        <div className="short-descriptions__list">
                          {product.short_description.map((item, index) => (
                            <div key={index} className="short-description">
                              <div className="short-description__icon">
                                <img src={item.icon} alt="" />
                              </div>
                              <p>
                                <span className="short-description__title">{item.title} — </span>
                                <span className="short-description__text">{item.value}</span>
                              </p>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : null}
                    <button className="characteristics__btn" onClick={scrollToAttributes}>
                      Все характеристики
                    </button>
                  </div>
                </div>
              </div>

              <div ref={attributesRef} className={`product-page__attributes attributes ${isAttributesHidden ? "attributes_hidden" : ""}`}>
                <h2 className="attributes__title title">Характеристики</h2>

                <div className="attributes__list">
                  {product.attributes && product.attributes.length > 0
                    ? product.attributes.map((group, index) => (
                        <div key={index} className="attributes__group">
                          <p className="attributes-group__title">{group.title}</p>

                          {group.items && group.items.length > 0 ? (
                            // Group attributes by title and join values with commas
                            <ul className="attributes__items">
                              {Object.entries(
                                group.items.reduce((acc, item) => {
                                  // Group by title
                                  if (!acc[item.title]) {
                                    acc[item.title] = [];
                                  }
                                  acc[item.title].push(item.value); // Collect values
                                  return acc;
                                }, {})
                              ).map(([title, values], idx) => (
                                <li key={idx} className="attribute">
                                  <span className="attribute__title">{title}</span>
                                  {/* Join values with commas */}
                                  <span className="attribute__value">{values.join(", ")}</span>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))
                    : null}
                </div>

                <div className="attributes__hide">
                  <div className={`attributes__btn`} onClick={toggleAttributesHidden}>
                    <p className="attributes-btn__text">{isAttributesHidden ? "Раскрыть весь список" : "Скрыть список"}</p>
                    <img className="attributes-btn__img" src={isAttributesHidden ? ArrowDown : ArrowUp} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductPage;
