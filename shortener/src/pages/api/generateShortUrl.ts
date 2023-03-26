import type { NextApiRequest, NextApiResponse } from "next";

function generateUniqueId() {
  // ここで一意のIDを生成
  return Math.random().toString(36).substr(2, 8);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const originalUrl = req.body.url;

    // URLが有効かどうかをチェック
    if (!originalUrl || !/^https?:\/\/.+/.test(originalUrl)) {
      res.status(400).json({ error: "Invalid URL" });
      return;
    }

    // 短縮URLを生成
    const shortId = generateUniqueId();
    const shortUrl = `${req.headers.origin}/${shortId}`;

    // 短縮URLを返す
    res.status(200).json({ originalUrl, shortUrl });
  } else {
    res.status(405).json({ error: "許可されていません" });
  }
}
