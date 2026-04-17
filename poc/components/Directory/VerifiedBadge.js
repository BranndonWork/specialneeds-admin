import {useTranslations} from 'next-intl';
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import Link from "next/link";

const VerifiedBadge = ({ listing, asLink = true }) => {
  const t = useTranslations('verifiedBadge');

  if (!listing?.listing_data?.verified_at) return null;
  const verifiedAt = new Date(listing?.listing_data?.verified_at);
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  if (verifiedAt < oneYearAgo) return null;
  const lastVerified = verifiedAt.toLocaleDateString("en-US");
  let title = t('tooltipContent').replace("<lastVerified>", lastVerified);
  const badgeStyles = {
    color: "var(--mainColor)",
    fontSize: "35px",
    verticalAlign: "middle",
    marginBottom: "5px",
    marginLeft: "10px",
  };
  if (!asLink) {
    return <VerifiedUserIcon sx={badgeStyles} title={title} aria-label={title} />;
  }

  return (
    <Link href="/verified-badge/" title={title} aria-label={title}>
      <VerifiedUserIcon sx={badgeStyles} />
    </Link>
  );
};
export default VerifiedBadge;
