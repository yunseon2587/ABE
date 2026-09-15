import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@libsql/client"],
  // 개발 모드 표시기가 사이드바 하단의 로그아웃 버튼과 겹치지 않도록 위치 이동.
  devIndicators: {
    position: "bottom-right",
  },
};

export default nextConfig;
