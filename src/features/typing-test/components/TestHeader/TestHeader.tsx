import Image from "next/image";
import Link from "next/link";

interface TestHeaderProps {
  bestWpm: number;
}

const TestHeader = ({ bestWpm }: TestHeaderProps) => {
  return (
    <header className="typing-test__header flex items-center justify-between leading-120 -tracking-04">
      <Link href="/" className="typing-test__link">
        <Image
          src="/images/logo-small.svg"
          alt=""
          width="32"
          height="32"
          className="typing-test__logo md:hidden"
        />
        <Image
          src="/images/logo-large.svg"
          alt=""
          width="267"
          height="40"
          className="typing-test__logo hidden md:block"
        />
      </Link>

      <p className="typing-test__personal-best flex items-center md:text-18">
        <span aria-hidden="true" className="mr-10">
          <Image
            src="/images/icon-personal-best.svg"
            alt=""
            width="21"
            height="18"
          />
        </span>
        <span className="text-neutral-400 hidden md:block">
          Personal best:&nbsp;
        </span>
        <span className="text-neutral-400 md:hidden">Best:&nbsp;</span>
        <output
          className="typing-test__personal-best-value text-white"
          aria-label="Personal best typing speed"
        >
          {bestWpm}&nbsp;
        </output>
        <abbr title="Words per minute" className="text-white">
          WPM
        </abbr>
      </p>
    </header>
  );
};

export default TestHeader;
