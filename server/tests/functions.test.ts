import { authenticate, sanitizeFilename } from "../src/functions";
import * as jwt from "jsonwebtoken";

describe("functions", () => {
  describe("authenticate", () => {
    const mockNext = jest.fn();
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("no token provided", () => {
      const mockReq = { cookies: {} } as any;

      authenticate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "No token provided",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test("invalid token", () => {
      const mockReq = { cookies: { token: "bad-token" } } as any;

      jest.spyOn(jwt, "verify").mockImplementation(() => {
        throw new Error("Invalid token");
      });

      authenticate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid token" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test("valid token", () => {
      const mockReq = { cookies: { token: "good-token" } } as any;

      jest.spyOn(jwt, "verify").mockImplementation(() => ({
        email: "user@example.com",
      }));

      authenticate(mockReq, mockRes, mockNext);

      expect(mockReq.user).toEqual({ email: "user@example.com" });
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe("sanitizeFilename", () => {
    test("removes directory paths", () => {
      const filename =
        "/home/aleksi/Työpöytä/Koulu/Secure Programming/exercise-work/passwd.txt";
      const sanitized = sanitizeFilename(filename);
      expect(sanitized).toBe("passwd.txt");
    });

    test("replaces invalid characters", () => {
      const filename = "crazy file!!@@.jpg";
      const sanitized = sanitizeFilename(filename);
      expect(sanitized).toBe("crazy-file----.jpg");
    });

    test("keeps safe characters", () => {
      const filename = "normal-file_name.2024.txt";
      const sanitized = sanitizeFilename(filename);
      expect(sanitized).toBe("normal-file_name.2024.txt");
    });

    test("truncates long filenames", () => {
      const filename = "a".repeat(300) + ".txt";
      const sanitized = sanitizeFilename(filename);
      expect(sanitized.length).toBeLessThanOrEqual(255);
    });
  });
});
