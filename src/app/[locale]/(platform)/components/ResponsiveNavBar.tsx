import MobilePlatformNavBar from "./MobilePlatfromNavBar";
import PlatformNavBar from "./PlatformNavBar";
const ResponsiveNavBar = () => {
  return (
    <>
      <div className="hidden md:block">
        <PlatformNavBar />
      </div>
      <MobilePlatformNavBar />
    </>
  );
};

export default ResponsiveNavBar;
