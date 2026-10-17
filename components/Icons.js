const base = { viewBox: '0 0 24 24', width: 22, height: 22, fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
const I = (children, extra = {}) => function Icon(props) { return <svg {...base} {...extra} {...props}>{children}</svg>; };
export const MapPinIcon = I(
  <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1116 0z" />
  <circle cx="12" cy="10" r="2.5" /></>,
  { width: 20, height: 20 }
);

export const PhoneIcon = I(
  <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.4 19.4 0 01-6-6A19.8 19.8 0 012 4.2 2 2 0 014 2h3a2 2 0 012 1.7c.1 1 .4 2 .7 2.9a2 2 0 01-.5 2.1L8 9.9a16 16 0 006 6l1.2-1.2a2 2 0 012.1-.5c.9.3 1.9.6 2.9.7a2 2 0 011.8 2z" />,
  { width: 20, height: 20 }
);

export const MailIcon = I(
  <><rect x="3" y="5" width="18" height="14" rx="2" />
  <path d="m3 7 9 6 9-6" /></>,
  { width: 20, height: 20 }
);
export const SearchIcon = I(<><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>);
export const UserIcon = I(<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" /></>);
export const BagIcon = I(<><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6a3 3 0 016 0v2" /></>);
export const ChevronDown = I(<path d="M6 9l6 6 6-6" />, { width: 12, height: 12, strokeWidth: 2 });
export const CloseIcon = I(<path d="M6 6l12 12M18 6L6 18" />);
export const MenuIcon = I(<path d="M4 7h16M4 12h16M4 17h16" />);
export const ArrowRight = I(<path d="M5 12h14M13 6l6 6-6 6" />, { width: 18, height: 18, strokeWidth: 1.2 });
export const FilterIcon = I(<path d="M3 4h18l-7 8v7l-4 2v-9L3 4z" fill="currentColor" stroke="none" />, { width: 22, height: 22 });
export const StarIcon = I(<path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.400 6.100 20.500l1.200-6.500L2.500 9.400l6.600-.9L12 2.500z" fill="currentColor" stroke="none" />, { width: 18, height: 18 });
export const FacebookIcon = I(<path d="M14 8h3V4h-3a4 4 0 00-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8z" fill="currentColor" stroke="none" />, { width: 20, height: 20 });
export const InstagramIcon = I(<><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.500" cy="6.500" r="1" fill="currentColor" /></>, { width: 20, height: 20 });
export const YoutubeIcon = I(<><rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor" stroke="none" /><path d="M10 9l5 3-5 3V9z" fill="#fff" stroke="none" /></>, { width: 22, height: 22 });
export const WhatsappIcon = I(<><path d="M12 3a9 9 0 00-7.700 13.600L3 21l4.500-1.200A9 9 0 1012 3z" /><path d="M9 8c0 4 3 7 7 7l1-2-2-1-1 1c-1-.5-2.500-2-3-3l1-1-1-2-2 1z" fill="currentColor" stroke="none" /></>, { width: 28, height: 28, strokeWidth: 1.5 });
export const ShippingIcon = I(<path d="M2 12l20-8-8 20-3-9-9-3z" />, { width: 34, height: 34, strokeWidth: 1.2 });
export const LeafIcon = I(<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19l8-8" />, { width: 34, height: 34, strokeWidth: 1.2 });
export const HeartHandIcon = I(<path d="M12 20s-7-4.500-7-10a4 4 0 017-2 4 4 0 017 2c0 5.500-7 10-7 10z" />, { width: 34, height: 34, strokeWidth: 1.2 });
export const PaypalIcon = I(<path d="M7 20l2-14h6a4 4 0 010 8H11l-1 6H7z" fill="#1c3d8f" stroke="none" />, { width: 28, height: 28 });
export const TrashIcon = I(<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />, { width: 18, height: 18, strokeWidth: 1.5 });
export const TruckIcon = I(<><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></>, { width: 30, height: 30, strokeWidth: 1.1 });
export const TagIcon = I(<><path d="M3 12V4h8l10 10-8 8L3 12z" /><circle cx="7.500" cy="8.500" r="1.200" /></>, { width: 20, height: 20, strokeWidth: 1.5 });
export const ChevronUp = I(<path d="M6 15l6-6 6 6" />, { width: 16, height: 16, strokeWidth: 2 });
export const ArrowLeft = I(<path d="M19 12H5M11 6l-6 6 6 6" />, { width: 22, height: 22, strokeWidth: 1.6 });
export const CheckIcon = I(<path d="M5 12l5 5 9-10" />, { width: 16, height: 16, strokeWidth: 3 });

export const SparklesIcon = I(
  <>
    <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3z" />
    <path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14z" />
  </>,
  { width: 28, height: 28, strokeWidth: 1.5 }
);

export const GiftIcon = I(
  <>
    <rect x="3" y="9" width="18" height="12" rx="1.5" />
    <path d="M2 5h20v4H2z" />
    <path d="M12 5v16M12 5H8.5a2.5 2.5 0 1 1 2.5-2.5V5zM12 5h3.5A2.5 2.5 0 1 0 13 2.5V5z" />
  </>,
  { width: 28, height: 28, strokeWidth: 1.5 }
);

export const QualityIcon = I(
  <>
    <path d="M12 3 19 6v5c0 4.5-3 7.5-7 10-4-2.5-7-5.5-7-10V6l7-3z" />
    <path d="m9 12 2 2 4-4" />
  </>,
  { width: 28, height: 28, strokeWidth: 1.5 }
);
