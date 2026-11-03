import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "node:crypto";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const runtime = "nodejs";

// Vercel caps serverless request bodies at 4.5 MB, so stay below it.
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const MAX_REQUEST_SIZE = 4.5 * 1024 * 1024;

const VERCEL_BLOB_API = "https://vercel.com/api/blob";
const VERCEL_BLOB_API_VERSION = "13";
const BLOB_UPLOAD_TIMEOUT_MS = 30_000;

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const SIGNATURE_CHECKS: Record<string, (buffer: Buffer) => boolean> = {
  "image/jpeg": (buffer) =>
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff,
  "image/png": (buffer) =>
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    ),
  "image/webp": (buffer) =>
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP",
  "image/gif": (buffer) => {
    const header = buffer.subarray(0, 6).toString("ascii");
    return header === "GIF87a" || header === "GIF89a";
  },
};

async function uploadToVercelBlob(
  buffer: Buffer,
  contentType: string,
  extension: string
): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN as string;
  const storeId = token.split("_")[3] || "";
  const pathname = `form-banners/${randomUUID()}.${extension}`;
  const query = new URLSearchParams({ pathname });

  const response = await fetch(`${VERCEL_BLOB_API}/?${query.toString()}`, {
    method: "PUT",
    headers: {
      authorization: `Bearer ${token}`,
      "x-api-version": VERCEL_BLOB_API_VERSION,
      "x-vercel-blob-access": "public",
      "x-content-type": contentType,
      "x-add-random-suffix": "0",
      "x-content-length": String(buffer.byteLength),
      ...(storeId ? { "x-vercel-blob-store-id": storeId } : {}),
    },
    body: buffer,
    signal: AbortSignal.timeout(BLOB_UPLOAD_TIMEOUT_MS),
  });

  const data = (await response.json().catch(() => null)) as
    | { url?: unknown }
    | null;

  if (
    !response.ok ||
    !data ||
    typeof data.url !== "string" ||
    !data.url.startsWith("https://")
  ) {
    throw new Error(`Vercel Blob upload failed with status ${response.status}`);
  }

  return data.url;
}

export async function POST(req: Request) {
  try {
    const { isAuthenticated } = getKindeServerSession();
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentLength = Number(req.headers.get("content-length") || 0);
    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_SIZE) {
      return NextResponse.json(
        { error: "File is too large" },
        { status: 413 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (
      !file ||
      typeof file === "string" ||
      typeof file.arrayBuffer !== "function"
    ) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "File is empty" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File is too large" },
        { status: 413 }
      );
    }

    const extension = ALLOWED_IMAGE_TYPES[file.type];
    if (!extension) {
      return NextResponse.json(
        { error: "Only JPG, PNG, WebP, or GIF images are allowed" },
        { status: 415 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!SIGNATURE_CHECKS[file.type](buffer)) {
      return NextResponse.json(
        { error: "File content does not match an allowed image type" },
        { status: 415 }
      );
    }

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const imageUrl = await uploadToVercelBlob(buffer, file.type, extension);
        return NextResponse.json({ success: true, imageUrl });
      } catch (error) {
        console.error("Vercel Blob upload error:", error);
        return NextResponse.json(
          { error: "Image storage is unavailable. Please try again." },
          { status: 502 }
        );
      }
    }

    if (process.env.VERCEL) {
      return NextResponse.json(
        {
          error:
            "Image uploads are not configured for this deployment. Add a Vercel Blob store or paste an image URL instead.",
        },
        { status: 503 }
      );
    }

    // Local development / self-hosted: store under public/uploads.
    const filename = `${randomUUID()}.${extension}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, filename);

    if (path.dirname(filePath) !== uploadDir) {
      return NextResponse.json({ error: "Invalid upload path" }, { status: 400 });
    }

    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, buffer, { flag: "wx" });

    return NextResponse.json({
      success: true,
      imageUrl: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
