import * as React from "react";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import { serveAsset } from "@utils/assetHelpers";

const GreenDot = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
}));
const MediumAvatar = styled(Avatar)(({ theme }) => ({
  width: 44,
  height: 44,
  border: `2px solid ${theme.palette.background.paper}`,
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: 66,
  height: 66,
  border: `2px solid ${theme.palette.background.paper}`,
  justifyContent: "center",
  display: "flex",
  alignItems: "center",
}));

export default function BadgeAvatars({ greenDot, avatarURL }) {
  const [imageError, setImageError] = useState(false);
  const defaultAvatar = serveAsset("missingAvatar", 100);

  let avatar;
  if (imageError) {
    avatar = defaultAvatar;
  } else if (avatarURL) {
    avatar = serveAsset(avatarURL, 100);
  } else {
    avatar = defaultAvatar;
  }

  const imgProps = {
    onError: () => setImageError(true)
  };

  return (
    <>
      {greenDot ? (
        <GreenDot
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
        >
          <LargeAvatar
            alt="User avatar"
            src={avatar}
            imgProps={imgProps}
          />
        </GreenDot>
      ) : (
        <LargeAvatar
          alt="User avatar"
          src={avatar}
          imgProps={imgProps}
        />
      )}
    </>
  );
}
