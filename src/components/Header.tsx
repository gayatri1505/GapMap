
import Logo from "./Logo";

const Header = () => {
  return (
    <header className="w-full border-b border-gapmap-gray/20">
      <div className="container mx-auto flex justify-between items-center py-4">
        <Logo />
        <h1 className="hidden sm:block font-medium text-sm text-muted-foreground">
          Your Personalized AI Skill Gap Analyzer
        </h1>
      </div>
    </header>
  );
};

export default Header;
