import "./ProductCard.css";
import { useContext } from "react";
import { FavoritesContext } from "../../context/FavoritesContext";
import { CityContext } from "../../context/CityContext";
import { Link } from "react-router-dom";
import Heart from "../../assets/images/icons/heart.svg";
import Compare from "../../assets/images/icons/compare.svg";
import Star from "../../assets/images/icons/star.svg";

const ProductCard = ({ product, type }) => {
    const { favorites, addToFavorite, removeFromFavorite } = useContext(FavoritesContext);
    const { selectedCity } = useContext(CityContext);

    const isFavorite = favorites.includes(product.sku);

    const toggleFavorite = () => {
        if (isFavorite) {
            removeFromFavorite(product.sku);
        } else {
            addToFavorite(product.sku);
        }
    };

    const getReviewWord = (count) => {
        switch (true) {
            case count % 10 === 1 && count % 100 !== 11:
                return "отзыв";
            case [2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100):
                return "отзыва";
            default:
                return "отзывов";
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("ru-RU").format(price);
    };

    const cityPrefix = selectedCity.uri ? `/${selectedCity.uri}` : "";

    return (
        <div className={`product-card ${type === "day" ? "product-card_day" : null}`}>
            <div className="product-card__header">
                <div className="product-card__stickers">
                    {product.stickers && product.stickers.length > 0
                        ? product.stickers.map((label, index) => (
                              <span key={index} style={{ background: `${label.background_color}` }} className="product-card__label">
                                  {label.title}
                              </span>
                          ))
                        : null}
                </div>
                <div className="product-card__actions">
                    <img className="product-card__action" src={Compare} alt="" />
                    <img className={`product-card__action ${isFavorite ? "product-card__action_active" : ""}`} src={Heart} alt="" onClick={toggleFavorite} />
                </div>
            </div>
            <Link className="product-card__view" to={`${cityPrefix}/p/${product.uri}`} title={product.title}>
                <img className="product-card__image" src={product.images && product.images.length > 0 ? product.images[0] : "https://placehold.co/600x400"} alt={product.title} />
            </Link>
            <Link className="product-card__title" to={`${cityPrefix}/p/${product.uri}`} title={product.title}>
                {product.title}
            </Link>
            <div className="product-card__reviews reviews">
                {product.reviews ? (
                    <>
                        <img className="reviews__icon" src={Star} alt="" />
                        <span className="reviews__rating">{product.rating * 0.05}</span>
                        <span className="reviews__text">
                            ({product.reviews} {getReviewWord(product.reviews)})
                        </span>
                    </>
                ) : (
                    <span className="reviews__text">Нет отзывов</span>
                )}
            </div>
            {type === "day" ? (
                <div className="product-card__footer">
                    <div className="product-card__price">
                        {product.price_from ? <span className="product-card__price-actual">от {formatPrice(product.price)} ₸</span> : <span className="product-card__price-actual">{formatPrice(product.price)} ₸</span>}
                        {product.old_price ? <span className="product-card__price-discount">{formatPrice(product.old_price)} ₸</span> : null}
                    </div>
                    <button className="product-card__button-cart">Купить</button>
                </div>
            ) : (
                <>
                    <div className="product-card__footer">
                        <div className="product-card__price">
                            {product.price_from ? <span className="product-card__price-actual">от {formatPrice(product.price)} ₸</span> : <span className="product-card__price-actual">{formatPrice(product.price)} ₸</span>}
                            {product.old_price ? <span className="product-card__price-discount">{formatPrice(product.old_price)} ₸</span> : null}
                        </div>
                    </div>
                    <button className="product-card__button-cart">Купить</button>
                </>
            )}
        </div>
    );
};

export default ProductCard;
