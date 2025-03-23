const Contact = () => {
  return (
    <div id="contact" className="bg-white py-8 px-6 md:px-16 lg:px-20">
      {/* Header Section */}
      <h1 className="text-green-600 text-2xl md:text-4xl font-bold mb-4">
        Contact Us
      </h1>
      <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6">
        We're here to help you with all your grocery needs. Reach out to us today!
      </p>

      {/* Contact Form Section */}
      <h2 className="text-green-600 text-xl md:text-3xl font-bold mb-4">
        Get in Touch
      </h2>
      <form className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-medium"
          >
            Your Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-medium"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1"
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="block text-gray-700 text-sm font-medium"
          >
            Message
          </label>
          <textarea
            id="message"
            placeholder="Type your message"
            rows={5}
            className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1"
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white font-medium px-6 py-2 rounded-md hover:bg-green-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Contact;
