// express.d.ts
import * as express from "express";
import mongoose from "mongoose";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
