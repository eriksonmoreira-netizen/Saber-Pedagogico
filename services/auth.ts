import { User } from '../types';

const SECRET_KEY = "saber-pedagogico-secret-key-mock";

// Simulate JWT Payload
interface JWTPayload {
  sub: string; // User ID
  email: string;
  role: string;
  exp: number;
}

export const authService = {
  createToken(user: User): string {
    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    // In a real app, this would be signed by the server. 
    // Here we strictly mock it with Base64 to simulate the structure.
    return btoa(JSON.stringify(payload));
  },

  verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = JSON.parse(atob(token));
      if (decoded.exp < Date.now()) {
        return null; // Expired
      }
      return decoded;
    } catch (e) {
      return null;
    }
  },

  getUserFromToken(token: string, users: User[]): User | null {
    const payload = this.verifyToken(token);
    if (!payload) return null;
    return users.find(u => u.id === payload.sub) || null;
  }
};