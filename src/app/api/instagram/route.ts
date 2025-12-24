import { NextResponse } from "next/server";

const IG_USER_ID = process.env.INSTAGRAM_USER_ID;
const IG_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

// Límite de posts a mostrar
const LIMIT = 8;

export async function GET() {
  if (!IG_USER_ID || !IG_ACCESS_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Instagram no está configurado. Falta INSTAGRAM_USER_ID o INSTAGRAM_ACCESS_TOKEN.",
      },
      { status: 500 }
    );
  }

  try {
    const fields =
      "id,caption,media_url,permalink,thumbnail_url,media_type,username";
    const url = `https://graph.instagram.com/${IG_USER_ID}/media?fields=${fields}&access_token=${IG_ACCESS_TOKEN}&limit=${LIMIT}`;

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      const text = await res.text();
      console.error("Error Instagram API:", text);
      return NextResponse.json(
        { error: "No se pudo cargar el feed de Instagram." },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error inesperado Instagram API:", err);
    return NextResponse.json(
      { error: "Error inesperado al cargar Instagram." },
      { status: 500 }
    );
  }
}