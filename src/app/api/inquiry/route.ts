import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const FILE = path.join(process.cwd(), "data", "submissions.json");

type Submission = {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string;
  tour: string;
  date: string;
  guests: string;
  subject: string;
  message: string;
  createdAt: string;
};

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim() : "");

  // Honeypot: bots fill the hidden "company" field. Silently accept and drop.
  if (str("company")) {
    return NextResponse.json({ ok: true });
  }

  const type = str("type") || "booking";
  const email = str("email");
  const name = str("name");
  const message = str("message");

  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }
  if (type !== "newsletter" && !name) {
    return NextResponse.json({ ok: false, error: "Please tell us your name." }, { status: 400 });
  }
  if (type === "contact" && !message) {
    return NextResponse.json({ ok: false, error: "Please include a message." }, { status: 400 });
  }
  if (type === "booking") {
    if (!str("tour")) {
      return NextResponse.json({ ok: false, error: "Please choose a tour." }, { status: 400 });
    }
    if (!str("date")) {
      return NextResponse.json({ ok: false, error: "Please choose a preferred date." }, { status: 400 });
    }
  }

  const entry: Submission = {
    id: crypto.randomUUID(),
    type,
    name,
    email,
    phone: str("phone"),
    tour: str("tour"),
    date: str("date"),
    guests: str("guests"),
    subject: str("subject"),
    message,
    createdAt: new Date().toISOString(),
  };

  try {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    let list: Submission[] = [];
    try {
      list = JSON.parse(await fs.readFile(FILE, "utf8"));
    } catch {
      list = [];
    }
    list.push(entry);
    await fs.writeFile(FILE, JSON.stringify(list, null, 2));
  } catch (err) {
    console.error("[inquiry] failed to persist", err);
    return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }

  console.log(`[inquiry] ${entry.type} from ${entry.email}${entry.tour ? ` — ${entry.tour}` : ""}`);
  return NextResponse.json({ ok: true });
}
