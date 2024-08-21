import { NextResponse, NextRequest } from "next/server";
import { pinata } from "@/utils/config";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    console.log(data.get("file"));
    const file: File | null = data.get("file") as unknown as File;
    const uploadData = await pinata.upload.file(file)
    return NextResponse.json(uploadData, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
