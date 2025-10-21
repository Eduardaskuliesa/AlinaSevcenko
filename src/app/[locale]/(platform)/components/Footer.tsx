import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary border-t border-secondary text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-white text-xl lg:text-2xl font-bold mb-3">
              Alina Savcenko
            </h3>
            <p className="text-sm lg:text-base leading-relaxed">
              Laern and grow with me - your journey to knowledge starts here.
            </p>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-base lg:text-lg">
              Courses
            </h4>
            <ul className="space-y-1.5 text-sm lg:text-base">
              <li>
                <Link
                  href="/courses"
                  className="hover:text-white transition-colors"
                >
                  All Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/my-courses"
                  className="hover:text-white transition-colors"
                >
                  My Learning
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-base lg:text-lg">
              Support
            </h4>
            <ul className="space-y-1.5 text-sm lg:text-base">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-base lg:text-lg">
              Legal
            </h4>
            <ul className="space-y-1.5 text-sm lg:text-base">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-light/60 mt-8 pt-6 text-sm lg:text-base text-center">
          <p>&copy; {currentYear} YourBrand. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
