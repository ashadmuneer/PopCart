import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

// Updated categoriesWithImage array with image URLs
const categoriesWithImage = [
  {
    id: "men",
    label: "Men",
    image:
      "https://res.cloudinary.com/dkvp2mun2/image/upload/v1730663417/170924-trending-feature-1-mens-data_hjcas1.jpg",
  },
  {
    id: "women",
    label: "Women",
    image:
      "https://res.cloudinary.com/dkvp2mun2/image/upload/v1730663954/Best-place-to-buy-Indian-wedding-outfits-for-women-to-buy-online-outside-of-India_kzadcx.jpg",
  },
  {
    id: "kids",
    label: "Kids",
    image:
      "https://res.cloudinary.com/dkvp2mun2/image/upload/v1730664210/AK_0324-copy-1024x683_x6fgxe.jpg",
  },
  {
    id: "accessories",
    label: "Accessories",
    image:
      "https://res.cloudinary.com/dkvp2mun2/image/upload/v1730664282/model-career-kit-still-life-top-view_23-2150217973_lkpkkh.avif",
  },
  {
    id: "footwear",
    label: "Footwear",
    image:
      "https://res.cloudinary.com/dkvp2mun2/image/upload/v1730664392/istockphoto-1279108197-170667a_1671687926903_1671687937504_1671687937504_efyjyl.avif",
  },
];

// Updated brandsWithLogo array with logo images
const brandsWithLogo = [
  {
    id: "nike",
    label: "Nike",
    logo: "https://res.cloudinary.com/dkvp2mun2/image/upload/v1730665211/pngwing.com_2_duszxd.png",
  },
  {
    id: "adidas",
    label: "Adidas",
    logo: "https://res.cloudinary.com/dkvp2mun2/image/upload/v1730665474/pngwing.com_1_xh7gny.png",
  },
  {
    id: "puma",
    label: "Puma",
    logo: "https://res.cloudinary.com/dkvp2mun2/image/upload/v1730665213/pngwing.com_w5t78i.png",
  },
  {
    id: "levi",
    label: "Levi's",
    logo: "https://res.cloudinary.com/dkvp2mun2/image/upload/v1730665210/pngwing.com_4_ivknjc.png",
  },
  {
    id: "zara",
    label: "Zara",
    logo: "https://res.cloudinary.com/dkvp2mun2/image/upload/v1730665210/pngwing.com_3_tvy6ft.png",
  },
  {
    id: "h&m",
    label: "H&M",
    logo: "https://res.cloudinary.com/dkvp2mun2/image/upload/v1730665209/pngwing.com_5_w9djxg.png",
  },
];
function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  console.log(productList, "productList");

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <div
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full transition-opacity duration-1000`}
                style={{
                  backgroundImage: `url(${slide?.image})`,
                  backgroundSize: "contain", // Use 'contain' to fit the image
                  backgroundRepeat: "no-repeat", // Prevent image repetition
                  backgroundPosition: "center", // Center the image
                }}
              />
            ))
          : null}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {featureImageList.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full cursor-pointer ${
                index === currentSlide ? "bg-white" : "bg-gray-500"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categoriesWithImage.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow w-full h-32 rounded-lg overflow-hidden relative"
                style={{
                  backgroundImage: `url(${categoryItem.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <CardContent className="flex items-center justify-center h-full bg-black bg-opacity-50">
                  <h3 className="text-white text-lg font-bold transition-colors duration-300 hover:text-red-00">
                    {categoryItem.label}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {brandsWithLogo.map((brandItem) => (
              <Card
                key={brandItem.id}
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow w-full h-32 rounded-lg overflow-hidden flex items-center justify-center"
              >
                <CardContent className="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
                  <img
                    src={brandItem.logo}
                    alt={brandItem.label}
                    className="h-16 md:h-24" // Adjust logo size
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
