export function convertYouTubeUrl(urlObj: URL): string {
  const hostname = urlObj.hostname.replace("www.", "");
  let videoId = "";

  if (hostname === "youtu.be") {
    videoId = urlObj.pathname.slice(1);
    return `https://www.youtube.com/embed/${videoId}`;
  }

  if (hostname === "youtube.com" || hostname === "youtube-nocookie.com") {
    if (urlObj.pathname === "/watch") {
      videoId = urlObj.searchParams.get("v") || "";
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    if (urlObj.pathname.startsWith("/shorts/")) {
      videoId = urlObj.pathname.replace("/shorts/", "");
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }

  return urlObj.toString();
}


export function isYoutube(urlObj: URL): boolean {
  const hostname = urlObj.hostname.replace("www.", "");

  if (hostname === "youtu.be" || hostname === "youtube.com" || hostname === "youtube-nocookie.com") {
    return true;
  }


  return false;
}

