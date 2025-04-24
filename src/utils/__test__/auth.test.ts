import { beforeEach, describe, expect, it } from "vitest";
import {
    clearLS,
    getAccessTokenFromLS,
    getProfileFromLS,
    getRefreshTokenFromLS,
    setAccessTokenToLS,
    setProfileToLS,
    setRefreshTokenToLS,
} from "../auth";

const access_token =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NzRmMjA5ZmIzNzMyMDQxNjFlZDM5OSIsImVtYWlsIjoieGVveGVvMTg5NUBnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDI1LTA0LTI0VDA3OjE2OjUwLjkyMloiLCJpYXQiOjE3NDU0NzkwMTAsImV4cCI6MTc0NTQ3OTAxNX0.0Z1xGf5t2hhZhidMtjmQJHAtDT1qt8A52LhGvLrTMdc";
const refresh_token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NzRmMjA5ZmIzNzMyMDQxNjFlZDM5OSIsImVtYWlsIjoieGVveGVvMTg5NUBnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDI1LTA0LTI0VDA3OjE2OjI5LjIxNFoiLCJpYXQiOjE3NDU0Nzg5ODksImV4cCI6MTc0NTQ4MjU4OX0.ApEL3vit_cIrYz9bCJz-SRdyYNmDu1ZXEmBsRkCvhXM";
export const profileJSON = `{
      "_id": "6774f209fb373204161ed399",
      "roles": ["User"],
      "email": "xeoxeo1895@gmail.com",
      "createdAt": "2025-01-01T07:43:05.676Z",
      "updatedAt": "2025-04-22T14:31:22.840Z",
      "__v": 0,
      "address": "HN",
      "date_of_birth": "2000-02-23T17:00:00.000Z",
      "name": "Lưu Hiếu",
      "phone": "03433103454",
      "avatar": "9e34479a-f14f-453c-b779-89f684251d8d.jpg"
    }`;

beforeEach(() => {
    localStorage.clear();
});
describe("access_token", () => {
    it("access_token được set vào localStorage", () => {
        setAccessTokenToLS(access_token);
        expect(getAccessTokenFromLS()).toBe(access_token);
    });
});

describe("refresh_token", () => {
    it("refresh_token được set vào localStorage", () => {
        setRefreshTokenToLS(refresh_token);
        expect(getRefreshTokenFromLS()).toEqual(refresh_token);
    });
});

describe("profile", () => {
    it("profile được set vào localStorage", () => {
        const profileObj = JSON.parse(profileJSON); // object

        setProfileToLS(profileObj); // lưu
        expect(getProfileFromLS()).toEqual(profileObj);
    });
});

describe("clearLS", () => {
    it("Xóa hết access_token, refresh_token, profile", () => {
        setRefreshTokenToLS(refresh_token);
        setAccessTokenToLS(access_token);
        setProfileToLS(JSON.parse(profileJSON));
        // ...
        clearLS();
        expect(getAccessTokenFromLS()).toBe("");
        expect(getRefreshTokenFromLS()).toBe("");
        expect(getProfileFromLS()).toBeNull();
    });
});
