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
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl as string);
      alert("短縮URLがクリップボードにコピーされました。");
    } catch (error) {
      alert("クリップボードにコピーできませんでした。");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.logo}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="50"
            height="50"
          >
            <g
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M4 4h16v16H4z"></path>
              <path d="M12 7l5 5-5 5"></path>
              <path d="M12 12H7"></path>
            </g>
          </svg>
        </div>
        <h1 className={styles.title}>短縮URL生成サービス</h1>
        <form onSubmit={handleSubmit}>
          <input
            className={styles.urlInput}
            type="text"
            placeholder="Enter URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button className={styles.generateButton} type="submit">
            短縮URLを生成
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}
        {shortUrl && (
          <p className={styles.shortUrlInfo}>
            短縮URLはこちら: <a href={shortUrl}>{shortUrl}</a>
            <button className={styles.copyButton} onClick={copyToClipboard}>
              コピー
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
