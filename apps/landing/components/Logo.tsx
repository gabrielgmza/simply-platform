import Link from 'next/link';

export default function Logo({ asLink = true }: { asLink?: boolean }) {
  const inner = (
    <span className="logo">
      <img src="/assets/simply-mark.png" alt="Simply" />
      <span>simply</span>
    </span>
  );
  return asLink ? <Link href="/" className="plain">{inner}</Link> : inner;
}
