import { MiddlewareFactory } from "@utils/middlewares/types";
import { stackMiddleWares } from "@utils/middlewares/stackMiddleWares";
import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";

const test: MiddlewareFactory = (next: NextMiddleware) => {
  return async (req: NextRequest, _next: NextFetchEvent) => {
    const res = NextResponse.next();

    return res;
  };
};

const middlewares = [test];
export default stackMiddleWares(middlewares);

export const config = {
  matcher: ["/api/:path*", "/((?!_next|favicon.ico|api).*)"],
};

interface GeoNextRequest extends NextRequest {
  geo?: {
    city?: string;
    country?: string;
    region?: string;
    latitude?: string;
    longitude?: string;
  };
}

const getGeoInfo = (req: GeoNextRequest) => {
  console.log("✅ Getting location...");
  const isDev = process.env.NODE_ENV === "development";
  const geo = isDev
    ? { country: "AE", city: "Dev Test City" } // Mock values for dev
    : req.geo || {};

  console.log("getGeoInfo: ", { geo });
  return {
    country: geo?.country || "AE",
    city: geo?.city || "Unknown",
  };
};

const setGeoHeaders = (
  response: NextResponse,
  geo: { country: string; city: string }
) => {
    response.headers.set(
    'Set-Cookie',
    `geo-country=${geo.country}; Path=/; SameSite=Lax`
  )
  response.headers.append(
    'Set-Cookie',
    `geo-city=${geo.city }; Path=/; SameSite=Lax`
  )
};

export function middleware(req: NextRequest) {
  console.log("✅ Middleware running on:", req.nextUrl.pathname)
  const geo = getGeoInfo(req);
  const res = NextResponse.next();
  setGeoHeaders(res, geo);
  return res;
}
