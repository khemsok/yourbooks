// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
  if (req.method === "POST") {
    fetch(process.env.NEXT_PUBLIC_AWS_RECOMMENDER_URL, {
      method: "POST",
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_AWS_API_KEY,
      },
      body: req.body,
    })
      .then((res) => res.json())
      .then((data) => {
        res.status(200).json({ data: data.isbn });
      })
      .catch((err) => {
        res.status(400).json({ message: "error" });
      });
  }
};
