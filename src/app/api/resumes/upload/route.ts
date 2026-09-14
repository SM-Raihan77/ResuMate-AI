import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import fs from "fs/promises";
import path from "path";

export const maxDuration = 30;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

export async function POST(request: NextRequest) {
  try {
    const session = await AuthService.getSession(request.headers);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in to upload photos." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("photo") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file provided." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Please upload a JPEG, PNG, WEBP, or GIF image.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "File size exceeds 2MB limit." },
        { status: 400 }
      );
    }

    // Determine extension
    let ext = "png";
    if (file.type === "image/jpeg") ext = "jpg";
    if (file.type === "image/webp") ext = "webp";
    if (file.type === "image/gif") ext = "gif";

    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const filename = `avatar-${uniqueId}.${ext}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Photo upload error:", error);
    const message = error instanceof Error ? error.message : "Failed to upload photo.";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
