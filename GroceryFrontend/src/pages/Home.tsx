import Category from '../components/Category';
import home_bg from '../images/home_bg.jpeg';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <div id="home" className="relative w-full">
        {/* Background Image */}
        <img
          src={home_bg}
          alt="Home Background"
          className="w-full h-[60vh] object-cover"
        />

        {/* Text over Image */}
        <div className="absolute top-0 left-0 w-full h-[60vh] flex flex-col justify-center pl-6 md:pl-16 lg:pl-20">
          <h1 className="text-green-600 text-2xl md:text-4xl font-bold drop-shadow-lg mb-2">
            Welcome to Sharmaji Grocery
          </h1>
          <p className="text-green-600 text-sm md:text-lg max-w-[90%] md:max-w-[60%]">
            Discover our wide range of products at your fingertips
          </p>
        </div>
      </div>

      {/* Category Section */}
      <div className="bg-white py-8">
        <Category />
      </div>
    </>
  );
};

export default Home;
