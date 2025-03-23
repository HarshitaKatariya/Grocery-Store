import Brand from "./Brand";

const Footer = () => {
  return (
    <footer className="bg-green-700 text-white py-8 px-6 mt-auto">
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-white pb-6">
        {/* Brand Section */}
        <div className="space-y-3 text-center md:text-left">
          <Brand />
          <p className="text-sm">
            Thanks for visiting our shop. We are dedicated to providing you with the best service!
          </p>
        </div>

        {/* Company Section */}
        <div className="space-y-3 text-center md:text-left">
          <h1 className="text-lg font-bold uppercase">Company</h1>
          <ul className="space-y-1">
            <li className="hover:underline cursor-pointer">About</li>
            <li className="hover:underline cursor-pointer">Contact</li>
            <li className="hover:underline cursor-pointer">Help</li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="space-y-3 text-center md:text-left">
          <h1 className="text-lg font-bold uppercase">Contact</h1>
          <p>
            Email:{" "}
            <a
              href="mailto:support@sharmajigrocery.com"
              className="underline hover:no-underline"
            >
              support@sharmajigrocery.com
            </a>
          </p>
          <p>
            Phone:{" "}
            <a
              href="tel:+919876543210"
              className="underline hover:no-underline"
            >
              +91 111111111
            </a>
          </p>
          <p>Address: 123 Market Street, Surat, Gujrat</p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="pt-6 text-center text-sm">
        <p>&copy; 2024 Sharmaji Grocery. All Rights Reserved.</p>
        <p>
          Developed by{" "}
          <a
            href="https://katariyaharshita.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline"
          >
            HK
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
