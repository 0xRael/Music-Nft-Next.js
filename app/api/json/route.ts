import { NextResponse, NextRequest } from "next/server";
import { pinata } from "@/utils/config"
import { toBlobs } from "viem";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    console.log(data.get("file"));
    const file: string | null = data.get("file") as unknown as string;
    const uploadData = await pinata.upload.json(JSON.parse(file));
    return NextResponse.json(uploadData, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
