interface Tweet {
  id: string;
  text: string;
  created_at: string;
}

async function getTweets(): Promise<Tweet[]> {
  const token = process.env.TWITTER_BEARER_TOKEN;
  if (!token) return [];

  try {
    // 1. Get user ID
    const userRes = await fetch(
      "https://api.twitter.com/2/users/by/username/OurDailyBreadC",
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 3600 },
      }
    );
    if (!userRes.ok) return [];
    const userData = await userRes.json();
    const userId = userData.data?.id;
    if (!userId) return [];

    // 2. Get recent tweets
    const tweetsRes = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?max_results=6&tweet.fields=created_at,text&exclude=retweets,replies`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 3600 },
      }
    );
    if (!tweetsRes.ok) return [];
    const tweetsData = await tweetsRes.json();
    return (tweetsData.data as Tweet[]) ?? [];
  } catch {
    return [];
  }
}

export async function XTimeline() {
  const tweets = await getTweets();

  if (tweets.length === 0) {
    return (
      <div className="max-w-xl mx-auto rounded-2xl border border-wheat/20 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-wheat/10">
          <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
          <div className="text-left">
            <p className="font-semibold text-foreground text-sm">Our Daily Bread</p>
            <p className="text-muted-foreground text-xs">@OurDailyBreadC</p>
          </div>
          <a
            href="https://x.com/OurDailyBreadC"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto bg-black text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-neutral-800 transition-colors"
          >
            Follow
          </a>
        </div>
        <div className="px-6 py-8 text-center text-muted-foreground text-sm">
          <p>No posts yet — check back soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      {/* Profile header */}
      <div className="flex items-center justify-between px-1 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
          <div className="text-left">
            <p className="font-semibold text-foreground text-sm">Our Daily Bread</p>
            <p className="text-muted-foreground text-xs">@OurDailyBreadC</p>
          </div>
        </div>
        <a
          href="https://x.com/OurDailyBreadC"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-neutral-800 transition-colors"
        >
          Follow
        </a>
      </div>

      {/* Tweet cards */}
      {tweets.map((tweet) => (
        <a
          key={tweet.id}
          href={`https://x.com/OurDailyBreadC/status/${tweet.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white rounded-2xl border border-wheat/15 shadow-sm p-5 text-left hover:border-wheat/40 hover:shadow-md transition-all group"
        >
          <p className="text-foreground text-sm leading-relaxed">{tweet.text}</p>
          <p className="text-muted-foreground text-xs mt-3">
            {new Date(tweet.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </a>
      ))}

      {/* Footer */}
      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground">
          Share your loaves with{" "}
          <a
            href="https://x.com/search?q=%23OurDailyBreadMovement"
            target="_blank"
            rel="noopener noreferrer"
            className="text-wheat font-semibold hover:underline"
          >
            #OurDailyBreadMovement
          </a>
        </p>
      </div>
    </div>
  );
}
