export interface AuthResponseDto {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  accessToken: string;
}
