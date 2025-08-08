import Banner from "../Banner/Banner";
import FeatureProducts from "../feature/featureProducts";
// import HotProducts from "../hotProducts/hotProducts";
import ArrivalProducts from "../NewArrivalProducts/ArrivalProducts";
import TopCategories from "../TopCategory/TopCategory";

const Home = () => {
  return (
    <div>
      <Banner />
      <TopCategories />
      {/* <HotProducts/> */}
      <FeatureProducts />
      <ArrivalProducts />
    </div>
  );
};

export default Home;
