type RequestItem = {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  request: () => Promise<unknown>;
};

class RequestManager {
  private _queue: RequestItem[] = [];
  private _running = 0;

  constructor(public limit: number, public interval: number) {}

  request(_request: () => Promise<unknown>) {
    return new Promise((resolve, reject) => {
      this._queue.push({ resolve, reject, request: _request });
      this._execute();
    });
  }

  private async _execute() {
    if (this._running < this.limit && this._queue.length > 0) {
      const item = this._queue.shift();
      if (!item) return;
      const { resolve, reject, request } = item;

      this._running++;
      try {
        const result = await request();
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        this._running--;
        setTimeout(() => this._execute(), this.interval);
      }
    }
  }
}

export default RequestManager;
