import request from "supertest";
import express from "express";
import { PORT } from "../../src/config/env";
import router from "../../src/routes";

const app = express();
app.use(express.json());
app.use(router);

jest.spyOn(console, "log").mockImplementation(() => {});

describe("Express App", () => {
  let server: any;

  it("should start the server on the correct port", done => {
    server = app.listen(PORT, () => {
      const address = server.address();
      if (typeof address === "object" && address !== null) {
        expect(address.port).toBe(Number(PORT));
      } else {
        throw new Error("Server address is not an object");
      }
      server.close(done);
    });
  }, 10000);
});
