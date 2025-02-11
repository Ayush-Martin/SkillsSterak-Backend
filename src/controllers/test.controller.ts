import { Request, Response } from "express";

class TestController {
  public async test(req: Request, res: Response) {
    res.send("Hello World");
  }
}

export default TestController;
