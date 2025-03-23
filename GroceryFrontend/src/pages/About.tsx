const About = () => {
  return (
    <div id="about" className="bg-white py-8 px-6 md:px-16 lg:px-20">
      {/* Header Section */}
      <h1 className="text-green-600 text-2xl md:text-4xl font-bold mb-4">
        About Sharmaji Grocery
      </h1>

      {/* Content Section */}
      <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6">
        Your trusted partner for quality groceries delivered to your doorstep. 
        Experience the best in fresh, organic, and everyday essentials.
      </p>

      <h2 className="text-green-600 text-xl md:text-3xl font-bold mb-4">
        Our Story
      </h2>
      <p className="text-gray-700 text-sm md:text-base leading-relaxed">
        Founded with a mission to provide fresh and quality groceries at affordable prices, Sharmaji Grocery has been a trusted name for families across the region. 
        We believe in supporting local farmers, ensuring sustainability, and bringing the best products to your table. From everyday staples to exotic ingredients, 
        we strive to meet all your grocery needs with a commitment to quality and customer satisfaction.
      </p>
    </div>
  );
};

export default About;
