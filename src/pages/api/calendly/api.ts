import { NextApiResponse } from "next";

const apiKey = process.env.CALENDLY_API_KEY;

const getDefaultHeaders = () => ({
  Authorization: `Bearer ${apiKey}`,
  "Content-Type": "application/json",
});

export const fetchUserDetails = async () => {
  const url = `https://api.calendly.com/users/me`;
  const response = await fetch(url, {
    headers: getDefaultHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user details: ${response.status}`);
  }

  const data = await response.json();

  return data;
};

export const fetchCalendlyData = async (
  url: string,
  res: NextApiResponse,
  method: string = "GET",
  body?: Record<string, any>
) => {
  const options: RequestInit = {
    method,
    headers: getDefaultHeaders(),
  };

  if (method !== "GET" && body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    res.status(response.status).json({ error: "Failed to fetch data from Calendly API" });
    throw new Error(`Error fetching data from ${url}: ${response.status}`);
  }

  return response.json();
};


