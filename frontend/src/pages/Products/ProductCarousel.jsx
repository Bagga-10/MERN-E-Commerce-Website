import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";

import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slideToShow: 1,
    slideToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  return (
    <div className="mb-4 xl:block lg:block md:block mx-2 my-4">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <Slider
          {...settings}
          className="xl:w-[50rem] lg:-[50rem] md:-[56rem] sm:w-[40rem] sm-block"
        >
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => (
              <div key={_id}>
                <img
                  src={image}
                  alt={name}
                  className="w-full rounded-lg object-cover h-[30rem]"
                />

                <div className="flex justify-between w-[20rem]">
                  <div className="one">
                    <h2 className="text-xl font-semibold text-gray-800 mt-2 mb-1">{name}</h2>
                    <p className="text-xl font-bold text-pink-600 mb-2">$ {price}</p> <br /> <br />
                    <p className="w-[25rem] text-gray-600 mb-4">
                      {description.substring(0, 170)} ...
                    </p>
                  </div>


                  <div className="flex justify-between w-[20rem]">
                    <div className="one">
                      <h1 className="flex items-center mb-6 w-[15rem]">
                        <FaStore className="text-pink-500 mr-2" /> Brand : {brand}
                      </h1>
                      <h1 className="flex items-center mb-6 w-[15rem]">
                        <FaClock className="text-yellow-500 mr-2" /> Added :{" "}
                        {moment(createdAt).fromNow()}
                      </h1>
                      <h1 className="flex items-center mb-6 w-[15rem] ">
                        <FaStar className="mr-2 text-indigo-500" /> Reviews : {numReviews}
                      </h1>
                    </div>

                    <div className="two">
                      <h1 className="flex items-center mb-6 w-[5rem] ">
                        <FaStar className=" text-yellow-500 mr-2" />
                        Rating:{Math.round(rating)}
                      </h1>
                      <h1 className="flex item-center mb-6 w-[rem]">
                        <FaShoppingCart className="text-green-600 mr-2" />
                        Quantity:{quantity}
                      </h1>
                      <h1 className="flex items-center mb-6 w-[10rem] ">
                        <FaBox className="mr-2 text-blue-500" />
                       In Stock:{countInStock}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
