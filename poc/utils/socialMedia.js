function extractSocialMedia(content) {
  const socialMediaPatterns = {
    facebook: {
      pattern: /facebook.com\/([a-zA-Z0-9._-]+)/i,
      url: "https://facebook.com/",
      label: "Facebook",
      class: "facebook-url",
    },
    instagram: {
      pattern: /instagram.com\/([a-zA-Z0-9._]+)/i,
      url: "https://instagram.com/",
      label: "Instagram",
      class: "instagram-url",
    },
    pinterest: {
      pattern: /pinterest.com\/([a-zA-Z0-9._]+)/i,
      url: "https://pinterest.com/",
      label: "Pinterest",
      class: "pinterest-url",
    },
    reddit: {
      pattern: /reddit.com\/user\/([a-zA-Z0-9._-]+)/i,
      url: "https://reddit.com/user/",
      label: "Reddit",
      class: "reddit-url",
    },
    snapchat: {
      pattern: /snapchat.com\/add\/([a-zA-Z0-9._-]+)/i,
      url: "https://snapchat.com/add/",
      label: "Snapchat",
      class: "snapchat-url",
    },
    tiktok: {
      pattern: /tiktok.com\/@([a-zA-Z0-9._]+)/i,
      url: "https://tiktok.com/@",
      label: "TikTok",
      class: "tiktok-url",
    },
    twitch: {
      pattern: /twitch.tv\/([a-zA-Z0-9._]+)/i,
      url: "https://twitch.tv/",
      label: "Twitch",
      class: "twitch-url",
    },
    twitter: {
      pattern: /twitter.com\/([a-zA-Z0-9._-]+)/i,
      url: "https://twitter.com/",
      label: "Twitter",
      class: "twitter-url",
    },
    youtube: {
      pattern: /youtube.com\/(channel|user)\/([a-zA-Z0-9._-]+)/i,
      url: "https://youtube.com/",
      label: "YouTube",
      class: "youtube-url",
    },
    threads: {
      pattern: /threads.net\/([a-zA-Z0-9._-]+)/i,
      url: "https://threads.net/",
      label: "Threads",
      class: "threads-url",
    },
  };

  const extractedData = {};

  for (const [platform, data] of Object.entries(socialMediaPatterns)) {
    const match = content.match(data.pattern);
    if (match && match[1]) {
      extractedData[platform] = {
        value: match[1],
        label: data.label,
        url: data.url + match[1],
        class: data.class,
      };
    }
  }

  return extractedData;
}
