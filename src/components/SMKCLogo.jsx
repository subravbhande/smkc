/**
 * SMKC Logo Component
 * Shows the official Sangli-Miraj-Kupwad Municipal Corporation emblem
 */
export default function SMKCLogo({ size = 36, className = '' }) {
  return (
    <img
      src="/smkc-logo.jpg"
      alt="SMKC – Sangli-Miraj-Kupwad Municipal Corporation"
      className={`object-contain rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
