
"use client";
import ProductImages from "./ProductImages";
import ProductInformation from "./ProductInformation";
import WhyChooseUs from "@/components/WhyChooseUs";
import { products } from "@/api/productsApi";
import CheckoutPage from "@/components/Checkout/CheckoutPage";

const ProductDetails = () => {
  return (
    <div>
      <div className="grid lg:grid-cols-2 gap-4 md:px-20 px-4">
        <div>
          <ProductImages />
        </div>
        <ProductInformation />
      </div>

      <WhyChooseUs />
      <CheckoutPage
        product={{
          ...products[0],
          image: products[0].images.front,
          quantity: 1,
        }}
      />
    </div>
  );
};

export default ProductDetails;
