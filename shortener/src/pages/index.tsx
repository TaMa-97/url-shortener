import { useState } from "react";
import styles from "../styles/Home.module.css";

const Home = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!url) {
      setError("URLを入力してください");
      return;
    }

    setError(null);
    setShortUrl(null);

    try {
      const response = await fetch("/api/generateShortUrl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        setError(error);
        return;
      }

      const { shortUrl } = await response.json();
      setShortUrl(shortUrl);
    } catch (error) {
      setError("エラーが発生しました。もう一度やり直してください。");
    }
  };

  return (
    <div>
      <h1>短縮URL生成サービス</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit">短縮URLを生成</button>
      </form>

      {error && <p className="error">{error}</p>}
      {shortUrl && (
        <p>
          短縮URLはこちら: <a href={shortUrl}>{shortUrl}</a>
        </p>
      )}
    </div>
  );
};

export default Home;
