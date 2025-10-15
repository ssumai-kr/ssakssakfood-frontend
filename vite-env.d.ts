/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_KAKAO_REST_API_KEY: string;
  readonly VITE_APP_KAKAO_SEARCH_KEY: string;
  readonly VITE_APP_KAKAO_MAP_KEY: string;
  readonly VITE_MEMBER_SERVER_URL: string;
  // 다른 env 변수도 여기 추가 가능
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
