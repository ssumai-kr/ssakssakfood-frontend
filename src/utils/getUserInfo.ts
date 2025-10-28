export type MemberType = "USER" | "OWNER";

export interface UserInfo {
  accessToken: string;
  memberId: number;
  memberType: MemberType;
}

export interface UserState {
  state: {
    user: UserInfo;
  };
  version: number;
}

/**
 * 로컬 스토리지에서 사용자 정보를 가져옵니다.
 * @returns UserInfo 객체 또는 null (비로그인 상태)
 */
export const getUserInfo = (): UserInfo | null => {
  try {
    const userDataString = localStorage.getItem("user");
    if (!userDataString) {
      return null;
    }

    const userData: UserState = JSON.parse(userDataString);
    return userData.state?.user || null;
  } catch (error) {
    console.error("Failed to parse user info from localStorage:", error);
    return null;
  }
};

/**
 * 사용자의 memberType을 가져옵니다.
 * @returns "USER" | "OWNER" | null
 */
export const getMemberType = (): MemberType | null => {
  const userInfo = getUserInfo();
  return userInfo?.memberType || null;
};

/**
 * 로그인 상태인지 확인합니다.
 * @returns boolean
 */
export const isLoggedIn = (): boolean => {
  return getUserInfo() !== null;
};
